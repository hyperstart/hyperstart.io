import { ModuleImpl } from "lib/modules"
import { getErrorMessage } from "lib/utils"

import * as api from "./api"

// # Types

export interface InitialSearch {
  name: string
  resultsPerPage?: number
  query?: string
  paneText?: string
  fieldText?: string
}

function checkSearchForNextPage(search: api.Search) {
  if (!search) {
    throw new Error("No search with name " + name)
  }
  if (
    search.status !== "success" ||
    typeof search.query !== "string" ||
    !search.hasNext
  ) {
    throw new Error(
      "Search with name '" +
        name +
        "' has an inconsistent state: " +
        JSON.stringify(search)
    )
  }

  const pageSize = search.resultsPerPage
  const offset = search.currentPage * pageSize

  // check result data
  if (search.results.length <= offset + pageSize) {
    throw new Error(
      "Search with name '" +
        name +
        "' has an inconsistent results length: " +
        search.results.length +
        " compared to the offset: " +
        offset
    )
  }
}

// # Module

export function createSearch(
  searches: InitialSearch[]
): ModuleImpl<api.State, api.Actions> {
  let searchFn: api.SearchFn
  return {
    state: {},
    actions: {
      // ## Internal
      init: () => {},
      setSearchFn: fn => {
        searchFn = fn
      },
      getState: () => state => state,
      // ## Public
      search: (payload: api.SearchPayload) => (
        state,
        actions
      ): Promise<api.Search> => {
        const { name, type } = payload
        const search = state[name]
        if (!search) {
          throw new Error("No search with name " + name)
        }
        const text = type === "pane" ? search.paneText : search.fieldText
        const searchResult = searchFn(text, {
          index: 0,
          count: search.resultsPerPage + 1
        })

        // error!
        if (typeof searchResult === "string") {
          const error = searchResult
          actions.update({ name, query: text, error, status: "error" })
          return
        }

        actions.update({
          name,
          currentPage: 0,
          highestPage: 0,
          query: text,
          paneText: text,
          status: "running",
          error: null,
          serverError: null
        })

        return searchResult
          .then(results => {
            const hasNext = results.length > search.resultsPerPage
            actions.update({ name, status: "success", results, hasNext })
            return actions.getState()[name]
          })
          .catch(e => {
            const serverError = getErrorMessage(e)
            actions.update({ name, status: "error", serverError })
            throw e
          })
      },
      nextPage: (name: string) => (state, actions): Promise<api.Search> => {
        // get/check result data
        const search = state[name]
        checkSearchForNextPage(search)

        const pageSize = search.resultsPerPage
        const offset = search.currentPage * pageSize

        // already searched for this, just increment the page
        if (search.highestPage >= search.currentPage + 1) {
          const currentPage = search.currentPage + 1
          const hasNext = search.results.length > offset + 2 * pageSize
          actions.update({ name, currentPage, hasNext })
          return
        }

        // not searched yet: do the search
        const searchResult = searchFn(search.query, {
          index: offset + pageSize + 1,
          value: search.results[offset + pageSize],
          count: search.resultsPerPage
        })

        // error while parsing query, this should never happen
        if (typeof searchResult === "string") {
          throw new Error("Not possible to get an error now!")
        }

        // start search: update search data
        const currentPage = search.currentPage + 1
        actions.update({
          name,
          currentPage,
          highestPage: currentPage,
          status: "running",
          error: null,
          serverError: null
        })

        return searchResult
          .then(values => {
            // update the state
            const results = search.results.concat(values)
            const hasNext = values.length === search.resultsPerPage
            actions.update({ name, status: "success", results, hasNext })
            return actions.getState()[name]
          })
          .catch(e => {
            // update the state
            const serverError = getErrorMessage(e)
            actions.update({ name, status: "error", serverError })
            throw e
          })
      },
      previousPage: (name: string) => state => {
        const search = state[name]
        if (!search || !search.currentPage || search.currentPage === 0) {
          return
        }

        return {
          [name]: {
            ...search,
            currentPage: search.currentPage - 1,
            hasNext: true
          }
        }
      },
      update: (payload: api.SearchUpdate) => state => {
        const { name, ...values } = payload
        return { [name]: { ...state[name], ...values } }
      }
    }
  }
}
