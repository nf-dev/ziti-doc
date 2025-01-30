// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// This docusaurus.config.js is used by GitHub Pages to build the site with baseUrl: '/docusaurus/'
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";

const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OpenZiti',
  tagline: 'Replacing Infrastructure With Software',
  url: 'https://openziti.io/',
  baseUrl: '/',
  trailingSlash: undefined,
  // onBrokenLinks: 'warn',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  onDuplicateRoutes: 'throw',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'OpenZiti', // Usually your GitHub org/user name.
  projectName: 'ziti', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'docs-policies',
        path: 'docs-policies',
        routeBasePath: 'policies',
        sidebarPath: require.resolve('./sidebar-policies.js'),
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects: path => {
          if ( path.startsWith("/docs/guides/topologies/gateway/") ) {
            return [path.replace("/docs/guides/topologies/gateway/","/docs/guides/local-gateway/")];
          }
          if ( path.startsWith("/docs/guides/deployments/kubernetes/") ) {
            return [path.replace("/docs/guides/deployments/kubernetes/","/docs/guides/kubernetes/hosting/")];
          }
          if ( path.startsWith("/docs/reference/tunnelers/kubernetes/") ) {
            return [path.replace("/docs/reference/tunnelers/kubernetes/","/docs/guides/kubernetes/workload-tunneling/")];
          }
          if ( path.startsWith("/docs/guides/deployments/") ) {
            return [
              path.replace("/docs/guides/deployments/","/docs/reference/deployments/"),
            ];
          }
          if ( path.startsWith("/docs/reference/developer/api/") ) {                       // for each existing page
            return [
              path.replace("/docs/reference/developer/api/","/api/"),                      // return a "from" redirect for each old path
              path.replace("/docs/reference/developer/api/","/api/rest/"),
              path.replace("/docs/reference/developer/api/","/api/rest/edge-apis/")
            ];
          }
          if ( path.startsWith("/docs/learn/quickstarts/") ) {
            return [path.replace("/docs/learn/quickstarts/","/docs/quickstarts/")];
          }
          if ( path.startsWith("/docs/learn/core-concepts/zero-trust-models/") ) {
            return [
              path.replace("/docs/learn/core-concepts/zero-trust-models/","/docs/deployment-architecture/"),
              path.replace("/docs/learn/core-concepts/zero-trust-models/","/docs/core-concepts/zero-trust-models/")
            ];
          }
          if ( path.startsWith("/docs/learn/core-concepts/") ) {
            return [path.replace("/docs/learn/core-concepts/","/docs/core-concepts/")];
          }
          if ( path.startsWith("/docs/learn/introduction/") ) {
            return [path.replace("/docs/learn/introduction/","/docs/introduction/")];
          }
          return undefined;
        },
        redirects: [
          {
            to: '/docs/category/deployments',
            from: ['/docs/reference/deployments']
          },
          {
            to: '/docs/guides/deployments/linux/controller/deploy',
            from: ['/docs/reference/deployments/controller']
          },
          {
            to: '/docs/guides/deployments/linux/router/cli-mgmt',
            from: ['/docs/reference/deployments/router/cli-mgmt']
          },
          {
            to: '/docs/guides/deployments/linux/router/deploy',
            from: ['/docs/reference/deployments/router/deployment']
          },
          {
            to: '/docs/guides/deployments/linux/router/router-configuration',
            from: ['/docs/reference/deployments/router/router-configuration']
          },
          {
            to: '/docs/reference/tunnelers/docker',
            from: ['/docs/reference/tunnelers/linux/container']
          },
          {
            to: '/docs/category/core-concepts',
            from: ['/docs/learn/core-concepts']
          },
          {
            to: '/docs/reference/tunnelers/nginx',
            from: ['/docs/guides/securing-apis/aks-api-with-nginx-ziti-module']
          },
          {
            to: '/docs/category/cloud',
            from: ['/docs/guides/Public_Cloud_Deployment']
          },
          {
            to: '/docs/guides/topologies/services',
            from: ['/docs/guides/Public_Cloud_Deployment/Services']
          },
          {
            to: '/docs/guides/deployments/cloud/router',
            from: ['/docs/guides/Public_Cloud_Deployment/Router']
          },
          {
            to: '/docs/guides/deployments/cloud/controller',
            from: ['/docs/guides/Public_Cloud_Deployment/Controller']
          },
          {
            to: '/docs/guides/topologies/gateway/tunneler',
            from: ['/docs/guides/Local_Gateway/EdgeTunnel']
          },
          {
            to: '/docs/guides/topologies/gateway/router',
            from: ['/docs/guides/Local_Gateway/EdgeRouter']
          },
          {
            to: '/docs/guides/deployments/linux/controller/backup',
            from: ['/docs/guides/database-backup', '/docs/reference/backup/controller']
          },
          {
            to: '/docs/reference/tunnelers/nginx',
            from: ['/docs/category/securing-apis']
          },
          {
            to: '/docs/category/cloud',
            from: ['/docs/category/public-cloud-deployment']
          },
          {
            to: '/docs/category/gateway',
            from: ['/docs/category/local-gateway']
          },
          {
            to: '/docs/category/kubernetes',
            from: ['/docs/category/hosting-openziti']
          },
          {
            to: '/blog/',
            from: ['/blog/zitification/prometheus/part1']
          },
          {
            to: '/docs/learn/core-concepts/data-flow-explainer',
            from: ['/docs/guides/data-flow-explainer'],
          },
          {
            to: '/docs/learn/core-concepts/metrics/overview',
            from: ['/docs/core-concepts/metrics', '/docs/core-concepts/metrics/metric-types'],
          },
          {
            to: '/docs/learn/core-concepts/security/authentication/external-jwt-signers',
            from: ['/ziti/security/authentication/external-jwt-signers.html'],
          },
          {
            to: '/docs/learn/core-concepts/identities/enrolling',
            from: ['/ziti/identities/enrolling.html'],
          },
          {
            to: '/docs/reference/tunnelers/',
            from: ['/ziti/clients/tunneler.html'],
          },
          {
            to: '/docs/reference/tunnelers/linux/',
            from: ['/ziti/clients/linux.html'],
          },
          {
            to: '/docs/learn/core-concepts/pki',
            from: ['/docs/manage/pki', '/operations/pki'],
          },
          {
            to: '/docs/reference/developer/sdk',
            from: ['/api/ziti-sdk-swift', '/api/ziti-c-sdk', '/api/ziti-sdk-csharp'],
          },
          {
            to: '/docs/reference/developer/sdk',
            from: ['/docs/core-concepts/clients/sdks'],
          },
          {
            to: '/docs/learn/introduction/',
            from: ['/docs', '/docs/learn', '/docs/introduction/intro', '/docusaurus/docs/overview', '/ziti/overview/', '/ziti/overview.html'],
          },
          {
            to: '/docs/learn/quickstarts/',
            from: ['/ziti/quickstarts/quickstart-overview.html', '/ziti/quickstarts/networks-overview.html', '/docs/learn/quickstarts/network', '/docs/quickstarts/network'],
          },
          {
            to: '/docs/learn/introduction/openziti-is-software',
            from: ['/docs/introduction/zitiSoftwareArchitecture', '/ziti/software-architecture.html'],
          },
          {
            to: '/policies/CODE_OF_CONDUCT',
            from: ['/policies'],
          },
          {
            to: '/docs/learn/quickstarts/services/',
            from: ['/docs/quickstarts/services/ztna'],
          },
          {
            to: '/docs/learn/quickstarts/zac/',
            from: ['/docs/quickstarts/zac/installation'],
          },
        ],
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/openziti/ziti-doc/tree/main/docusaurus',
          beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives, ],
          remarkPlugins: [
            require('./src/plugins/remark/remark-yaml-table'),
            require('./src/plugins/remark/remark-code-block'),
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        debug: true,
        googleTagManager: {
          containerId: 'GTM-5SF399H3',
        },
      }),
    ],
    // Redocusaurus config
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            id: 'edge-client',
            spec: 'https://get.openziti.io/spec/client.yml',
          },
          {
            id: 'edge-management',
            spec: 'https://get.openziti.io/spec/management.yml',
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
          primaryColor: '#1890ff',
        },
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      metadata: [
        {name: 'description', content: 'open source zero trust'},
        {name: 'robots', content: 'index, follow'},
      ],
      algolia: {
        // The application ID provided by Algolia
        appId: 'EXWPKK5PV4',
  
        // Public API key: it is safe to commit it
        apiKey: '47858a78ccf0246d9b9cf4efaf6a1b8b',
  
        indexName: 'openziti',
  
        // Optional: see doc section below
        contextualSearch: true,
  
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.example\\.com|thirdparty\\.example\\.com',
  
        // Optional: Algolia search parameters
        searchParameters: {},
  
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
  
        //... other Algolia params
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: '',
        hideOnScroll: false,
        logo: {
          alt: 'The OpenZiti logo, an open source zero trust network overlay',
          src: 'img/ziti-logo-dark.svg',
          srcDark: 'img/ziti-logo-light.svg',
          href: 'https://openziti.io',
          target: "_self",
        },
        items: [
          {
            to: '/docs/learn/introduction/',
            label: 'Documentation',
            position: 'right',
            activeBaseRegex: '/docs/(?!downloads)',
          },
          {
            to: '/docs/downloads',
            label: 'Downloads',
            position: 'right',
            activeBaseRegex: '/docs/downloads',
          },
          {
            to: 'https://blog.openziti.io/',
            label: 'Blog',
            position: 'right'
          },
          {
            type: 'dropdown',
            label: 'Links',
            position: 'right',
            items: [
              {
                type: 'html',
                value: '<div class="text-divider"><p>Socials</p></div>'
              },
              {
                type: 'html',
                value: '<a href="https://www.youtube.com/OpenZiti" target="_blank" title="OpenZiti on YouTube"><span id="navbarDropdownItem"><img id="navbarDropdownImage" src="/img/yt.svg"/>YouTube</span></a>'
              },
              {
                type: 'html',
                value: '<a href="https://x.com/OpenZiti" target="_blank" title="OpenZiti on X(formerly Twitter)"><span id="navbarDropdownItem"><img id="navbarDropdownImage" src="/img/twit.svg"/>Twitter</span></a>'
              },
              {
                type: 'html',
                value: '<a href="https://www.reddit.com/r/openziti" target="_blank" title="OpenZiti Subreddit"><span id="navbarDropdownItem"><img id="navbarDropdownImage" src="/img/reddit-logo.png"/>Reddit</span></a>'
              },
              {
                type: 'html',
                value: '<span id="navbarDropdownItem"><img id="navbarDropdownImage" src="/img/ziggy.png"/><a href="https://x.com/OpenZiggy" target="_blank" title="OpenZiggy on Twitter">Ziggy</span></a>'
              },
              {
                type: 'html',
                value: '<div class="text-divider"><p>Other</p></div>'
              },
              {
                type: 'html',
                value: '<span id="navbarDropdownItem"><img id="navbarDropdownImage" src="/img/blog-icon.png"/><a href="https://blog.openziti.io/" target="_blank" title="Blog">Blog</span></a>'
              },
              {
                type: 'html',
                value: '<span id="navbarDropdownItem"><img id="navbarDropdownImage" src="/img/oz-test-kitchen.png"/><a href="https://github.com/openziti-test-kitchen" target="_blank" title="Git project for the test kitchen">Test Kitchen</span></a>'
              },
            ]
          },
          {
            href: 'https://openziti.discourse.group/',
            position: 'right',
            className: 'header-discourse-link',
            title: 'Discourse'
          },
          {
            href: 'https://github.com/openziti/ziti',
            position: 'right',
            className: 'header-github-link',
            title: 'GitHub'
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            label: 'Policies',
            to: '/policies/CODE_OF_CONDUCT',
          },
          {
            label: 'NetFoundry Cloud',
            to: 'https://netfoundry.io/products/netfoundry-platform/netfoundry-cloud-for-openziti/'
          },
          {
            label: 'Blog',
            to: 'https://blog.openziti.io'
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NetFoundry Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        // scala necessary to avoid Cannot set properties of undefined (setting 'triple-quoted-string')
        // see https://github.com/Redocly/redoc/issues/2511
        additionalLanguages: ['python', 'java', 'csharp', 'go', 'bash', 'scala'],
      },
    },
};

module.exports = config;

{
  plugins: [
    'docusaurus-plugin-hotjar',
  ]
}
