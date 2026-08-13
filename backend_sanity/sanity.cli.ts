import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'khsof0do',
    dataset: 'production'
  },

  // Pinned so `sanity deploy` can never be run interactively against the wrong
  // hostname, and so CI can deploy without being prompted for one.
  studioHost: 'mvmories',

  // Pinned for the same reason as studioHost: without it the CLI asks which
  // application to deploy to, and a non-interactive CI run has no way to answer.
  deployment: {
    appId: '086c1cf6cc706210dbc40489',
  },
})
