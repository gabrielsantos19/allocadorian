
const routes = [
  {
    path: '/personalizada',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Personalizada.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Solucoes.vue') }
    ]
  },
  {
    path: '/vetores',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Vetores.vue') }
    ]
  },
  {
    path: '/conjuntos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Conjuntos.vue') }
    ]
  },
  {
    path: '/configuracoes',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Configuracoes.vue') }
    ]
  },
  {
    path: '/sobre',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Sobre.vue') }
    ]
  },

  {
    path: '/solucao',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Solucao.vue') }
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
