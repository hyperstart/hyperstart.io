import { h } from "hyperapp"

import { ProjectsSearch } from "lib/search/ProjectsSearch"
import { Button } from "lib/components"

import { State, Actions } from "api"
import { UserSignUpForm } from "users"
import { LogFn } from "logger"

import "./IndexPage.scss"

import { createProject } from "createProject"
import { BlankTemplateCard, HyperappTemplateCard } from "./CreateProjectModal"

export interface IndexPageProps {
  state: State
  actions: Actions
  log: LogFn
}

function SignUpForm(props: IndexPageProps) {
  const { state, actions, log } = props

  if (state.users.user) {
    const blankTemplate = state.ui.createProjectTemplate === "blank"
    const create = () => {
      createProject(state, actions, state.ui.createProjectTemplate)
    }
    return (
      <div class="create-project">
        <h3 class="text-center">Create a project</h3>
        <div style={{ display: "flex" }}>
          <BlankTemplateCard
            selected={blankTemplate}
            select={() => actions.ui.selectCreateProjectTemplate("blank")}
          />
          <HyperappTemplateCard
            selected={!blankTemplate}
            select={() => actions.ui.selectCreateProjectTemplate("hyperapp")}
          />
        </div>
        <Button primary={true} text="Create" onclick={create} />
      </div>
    )
  }

  return <UserSignUpForm state={state.users} actions={actions.users} />
}

export function IndexPage(props: IndexPageProps) {
  const { state, actions, log } = props

  return (
    <div class="index-page">
      <div class="jumbotron jumbotron-home">
        <div clas="container">
          <div class="columns">
            <div class="col-6 col-md-12 px-2">
              <h1 class="hero-header text-center py-6 px-2">
                Code JavaScript apps faster using Hyperapp
              </h1>
              <h5 class="py-6 px-2 text-justify">
                Hyperstart allows you to create and share JavaScript projects,
                ranging from code snippets to fully-fledged projects, with zero
                setup. Use{" "}
                <a href="https://github.com/hyperapp/hyperapp" target="_blank">
                  Hyperapp
                </a>{" "}
                and our integrated devtools to speed up your project development
                cycle.
              </h5>
              <h5 class="px-2 pb-30 hide-md">
                Create an account for free and try it out &nbsp;
                <i
                  class="fa fa-long-arrow-right set-primary"
                  aria-hidden="true"
                />
              </h5>
            </div>
            <div class="col-4 hide-md text-left py-10 mx-auto centered">
              <SignUpForm state={state} actions={actions} log={log} />
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="columns">
          <div class="column col-12">
            <h2 class="text-center">Features</h2>
          </div>
          <div class="column col-4 col-md-12 centered p-2">
            <i
              class="fa fa-cogs fa-5x text-center col-12 m-2"
              aria-hidden="true"
            />
            <h4 class="text-center">Integrated Devtools</h4>
            <p>
              Projects using{" "}
              <a href="https://github.com/hyperapp/hyperapp" target="_blank">
                Hyperapp
              </a>{" "}
              count with powerful devtools, such as an integrated time travel
              debugger.
            </p>{" "}
            <a
              href="#"
              onclick={e => {
                e.preventDefault()
                createProject(state, actions, "hyperapp")
              }}
            >
              Try it out with a test Hyperapp project.
            </a>
          </div>

          <div class="column col-4 col-md-12 centered p-2">
            <i
              class="fa fa-repeat fa-5x text-center col-12 m-2"
              aria-hidden="true"
            />
            <h4 class="text-center">Reusability</h4>
            <p>
              Since all projects are open-source, you can search all available
              projects and re-use them as dependencies on your code.
            </p>
            <a href="#search">Search for an existing project.</a>
          </div>

          <div class="column col-4 col-md-12 centered p-2">
            <i
              class="fa fa-pencil-square-o fa-5x text-center col-12 m-2"
              aria-hidden="true"
            />
            <h4 class="text-center">Built for Hyperapp</h4>
            <p>
              This website has been built using{" "}
              <a href="https://github.com/hyperapp/hyperapp" target="_blank">
                Hyperapp
              </a>, and has been optimised to speed up the development process
              using the framework.
            </p>
            <a href="/blog">Start learning Hyperapp.</a>
          </div>

          <div class="column col-12 hide-md text-center py-10">
            <Button
              primary={true}
              text="Create an Account to Save Your Projects"
              size="lg"
              onclick={() => {
                actions.users.showSignUpModal()
              }}
            />
          </div>
        </div>
      </div>

      <div class="container">
        <div class="columns">
          <a name="search" />
          <div class="column col-12 p-2">
            <h2 class="text-center p-2">Explore Existing Projects</h2>
            <div class="col-8 col-md-12 centered text-left">
              <p class="p-2">
                Try typing "Hyperapp" into the search below to see our own
                Hyperapp examples and learn how to use the framework, or search
                for any existing project on Hyperstart. You can also{" "}
                <a
                  href="#"
                  onclick={e => {
                    e.preventDefault()
                    props.actions.ui.openCreateProjectModal()
                  }}
                >
                  create your own project
                </a>{" "}
                and reuse any project as a dependency.
              </p>
            </div>
            {ProjectsSearch({
              state: state.search,
              actions: actions.search,
              log
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
