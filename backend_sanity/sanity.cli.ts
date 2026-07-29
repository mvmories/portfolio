import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'khsof0do',
    dataset: 'production'
  },

  // Pinned so `sanity deploy` can never be run interactively against the wrong
  // hostname, and so CI can deploy without being prompted for one.
  studioHost: 'mvmories'
})
