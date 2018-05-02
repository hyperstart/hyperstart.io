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
        <div class="padding-card">
          <Button
            primary={true}
            size="lg"
            block={true}
            text="Create"
            onclick={create}
          />
        </div>
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
                  class="fas fa-long-arrow-alt-right set-primary"
                  aria-hidden="true"
                />
              </h5>
            </div>
            <div class="col-4 hide-md text-center py-10 mx-auto centered">
              <SignUpForm state={state} actions={actions} log={log} />
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="columns">
          <div class="column col-12 py-4">
            <h2 class="text-center">Features</h2>
          </div>
          <div class="col-4 col-md-12 centered py-2 px-4">
            <i
              class="fas fa-cogs fa-5x text-center col-12 m-2"
              aria-hidden="true"
            />
            <h4 class="text-center py-2">Integrated Devtools</h4>
            <p>
              We don't just provide a development environment, we also integrate
              ways to create better code in it and speed up your development
              cycle. Projects using{" "}
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
              Try it out with a test project.
            </a>
          </div>

          <div class="col-4 col-md-12 centered py-2 px-4">
            <i
              class="fas fa-redo fa-5x text-center col-12 m-2"
              aria-hidden="true"
            />
            <h4 class="text-center py-2">Reusability</h4>
            <p>
              We believe in open-source: this website is completely open and
              available on{" "}
              <a href="https://github.com/hyperstart/hyperstart.io">Github</a>.
              Since all projects hosted on Hyperstart are also open-source, you
              can search available projects and re-use them as dependencies on
              your code.
            </p>
            <a href="#search">Search for an existing project.</a>
          </div>

          <div class="col-4 col-md-12 centered py-2 px-4">
            <i
              class="fab fa-npm fa-5x text-center col-12 m-2"
              aria-hidden="true"
            />
            <h4 class="text-center py-2">NPM Support</h4>
            <p>
              All of your usual libraries are supported here without any changes
              required. Projects can import from any npm package and use them as
              dependencies. Importing a dependency never takes more than a few
              seconds.
            </p>
            <a href="/docs">Visit our documentation to learn more.</a>
          </div>

          <div class="column col-4 centered hide-md text-center py-14">
            <Button
              primary={true}
              text="Create an Account"
              size="lg"
              class="btn-large-font"
              onclick={() => {
                actions.users.showSignUpModal()
              }}
            />
          </div>
        </div>
      </div>

      <div class="container">
        <div class="columns">
          <div class="column col-12 centered text-center py-6">
            <h2>Developed For Hyperapp</h2>
          </div>
          <div class="column col-8 centered text-left py-2">
            <p>
              Hyperapp is a tiny JavaScript framework which focuses on being
              minimal, pragmatic and standalone. All applications are composed
              of a state, view, and actions. It has been influenced by the Elm
              language and brings many of its features to JavaScript, such as
              hot-module reloading, code completeness and no runtime exceptions.
              It contains all the features from the most famous frameworks,
              while being easy to learn and more performant. If you have any
              questions, check out the learning resources on our blog. We are
              happy to answer any questions you might have either by e-mail, or
              on the Hyperapp Slack channel.{" "}
            </p>
          </div>
          <div class="column col-6 centered text-center py-2">
            <a
              href="https://github.com/hyperapp/hyperapp"
              target="_blank"
              class="px-2 float-left"
            >
              Check out the project on Github.
            </a>
            <a
              href="https://blog.hyperstart.io"
              target="_blank"
              class="px-2 float-right"
            >
              Visit our blog to learn more.
            </a>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="columns">
          <a name="search" />
          <div class="column col-12 py-14">
            <h2 class="text-center p-2">Explore Existing Projects</h2>
            <div class="col-9 col-md-12 centered text-left">
              <p class="py-2">
                You can find a list of all available projects here. Try typing
                "Hyperapp" into the search below to see our own examples and
                learn how to use the framework, or search for any existing
                project on Hyperstart. You can also{" "}
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
