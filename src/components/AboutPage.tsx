import { h } from "hyperapp"

export interface AboutPageProps {
  // nothing for now
}

export function AboutPage(props: AboutPageProps) {
  return (
    <div class="index-page container">
      <div class="columns">
        <div class="col-9 centered">
          <h1 class="text-center">Our Goal</h1>
          <p class="text-center large-font">
            Making the most productive development environment for specific
            frameworks.
          </p>
          <h2 class="text-center title-padding">About Us</h2>
          <p>
            Hyperstart has been created by Anthony Ferrando and Henrique
            Spotorno. We are two developers who met while working on the
            stress-driven atmosphere of a startup on the verge of growing up.
          </p>
        </div>
      </div>
    </div>
  )
}
