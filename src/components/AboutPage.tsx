import { h } from "hyperapp"

import "./AboutPage.scss"

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
            Making the most productive development environment for small
            JavaScript frameworks.
          </p>
        </div>
        <div class="col-10 centered">
          <h2 class="text-center title-padding">About Us</h2>
          <p>
            Hyperstart was created by Anthony Ferrando and Henrique Spotorno. We
            are two developers who met while working in projects for an
            enterprise-driven start-up company. We grew fatigued of working and
            dealing with the issues of the bigger JavaScript frameworks, until
            we found a clean solution in Hyperapp. Wanting to contribute to the
            commmunity and strengthen the toolkits for smaller frameworks, we
            decided to build Hyperstart and the devtools that power it.
            Hyperstart seeks to improve productivity and collaboration for
            smaller frameworks.
          </p>
          <p>
            A quick word on monetization, because as a user of this website this
            is something that directly concerns you - Hyperstart is currently
            supported by us. We won't do anything with your data and your
            privacy is safe.
          </p>
        </div>
        <div class="col-10 centered text-center">
          <h2 class="title-padding">The Team</h2>
          <div class="columns py-4 px-2">
            <div class="col-3 py-2 text-left">
              <h3>Anthony, the Developer</h3>
              <h5>Core Product Development</h5>
              <p class="text-justify">
                Anthony is passionate about coding and creating things. He
                worked in many different projects before landing on Hyperstart,
                to which he now dedicates his full attention.
              </p>
            </div>
            <div class="col-2 col-mx-auto py-4">
              <img
                src="/anthony.jpg"
                class="round-image"
                alt="anthony the developer"
                align="left"
              />
            </div>
            <div class="col-3 col-ml-auto py-2 text-left">
              <h3>Henrique, the Human</h3>
              <h5>Core Business Development</h5>
              <p class="text-justify">
                Henrique worked in small- and medium-sized companies before
                deciding to follow start-up life. He lived in Brazil, Canada and
                Germany before settling in Austria.
              </p>
            </div>
            <div class="col-2 col-mr-auto py-4">
              <img
                src="/henrique.jpg"
                class="round-image float-right"
                alt="henrique the human"
              />
            </div>
          </div>
          <div class="columns py-4">
            <div class="col-2 col-ml-auto py-2">
              <img
                src="/miki.png"
                class="round-image"
                alt="miki the dog"
                align="left"
              />
            </div>
            <div class="col-4 col-mr-auto py-4 text-left">
              <h3>Miki, the Dog</h3>
              <h5>Customer Satisfaction</h5>
              <p>
                Who's a good girl? Miki is a good girl. She will rip up any
                written complaints before they make it to our desk.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="columns last-margin">
        <div class="col-12 centered">
          <h2 class="text-center title-padding">Contact Us</h2>
        </div>
        <div class="col-2 col-ml-auto col-md-8">
          <i class="far fa-envelope fa-2x" />
          <a
            href="mailto:contact@hyperstart.io"
            class="px-4 huge-font"
            target="_blank"
          >
            Email
          </a>
        </div>
        <div class="col-2 col-md-8">
          <i class="fab fa-twitter-square fa-2x" />
          <a
            href="https://twitter.com/HyperstartJS"
            class="px-4 huge-font"
            target="_blank"
          >
            Twitter
          </a>
        </div>
        <div class="col-2 col-mr-auto col-md-8">
          <i class="fab fa-slack fa-2x" />
          <a
            href="https://hyperapp.slack.com/messages/C9CDF88P9"
            class="px-4 huge-font"
            target="_blank"
          >
            Slack
          </a>
        </div>
      </div>
    </div>
  )
}
