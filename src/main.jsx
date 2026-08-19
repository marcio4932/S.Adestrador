import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const App = {
  user: null,
  role: null,
  tela: 'login',

  async init() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await this.carregarUsuario(user)
    this.render()
  },

  async carregarUsuario(user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    this.user = data
    this.role = data.role
    this.tela = data.role === 'admin' ? 'admin-dashboard' : 'cliente-dashboard'
  },

  render() {
    const app = document.getElementById('app')
    if (this.tela === 'login') {
      app.innerHTML = this.telaLogin()
      this.eventosLogin()
    } else if (this.tela === 'admin-dashboard') {
      app.innerHTML = this.telaAdmin()
      this.eventosAdmin()
    } else if (this.tela === 'cliente-dashboard') {
      app.innerHTML = this.telaCliente()
      this.eventosCliente()
    }
  },

  telaLogin() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700">
        <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div class="text-center mb-8">
            <i class="fa fa-paw text-5xl text-amber-600 mb-2"></i>
            <h1 class="text-3xl font-bold text-gray-800">S.Adestrador</h1>
            <p class="text-gray-500">Gestão e Treinamento Canino</p>
          </div>
          <form id="loginForm" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-1">E-mail</label>
              <input type="email" id="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1">Senha</label>
              <input type="password" id="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
            </div>
            <button type="submit" class="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition">
              Entrar
            </button>
          </form>
        </div>
      </div>
    `
  },

  eventosLogin() {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return alert('Erro: ' + error.message)
      
      const { data: { user } } = await supabase.auth.getUser()
      await this.carregarUsuario(user)
      this.render()
    })
  },

  telaAdmin() {
    return `
      <div class="min-h-screen flex">
        <aside class="w-64 bg-gray-800 text-white p-5">
          <h2 class="text-xl font-bold mb-6 flex items-center"><i class="fa fa-paw mr-2"></i>S.Adestrador</h2>
          <nav class="space-y-2">
            <a href="#" class="block px-3 py-2 rounded bg-amber-600"><i class="fa fa-home mr-2"></i>Dashboard</a>
            <a href="#" class="block px-3 py-2 hover:bg-gray-700"><i class="fa fa-users mr-2"></i>Clientes</a>
            <a href="#" class="block px-3 py-2 hover:bg-gray-700"><i class="fa fa-dog mr-2"></i>Cães</a>
            <a href="#" class="block px-3 py-2 hover:bg-gray-700"><i class="fa fa-list mr-2"></i>Planos de Treino</a>
            <a href="#" class="block px-3 py-2 hover:bg-gray-700"><i class="fa fa-calendar mr-2"></i>Calendário</a>
            <a href="#" id="btnSair" class="block px-3 py-2 hover:bg-red-600 mt-8"><i class="fa fa-sign-out mr-2"></i>Sair</a>
          </nav>
        </aside>
        <main class="flex-1 p-8">
          <h1 class="text-2xl font-bold mb-6">Painel do Adestrador</h1>
          <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow"><h3 class="text-gray-500">Clientes Ativos</h3><p class="text-3xl font-bold text-amber-600">0</p></div>
            <div class="bg-white p-6 rounded-xl shadow"><h3 class="text-gray-500">Cães Cadastrados</h3><p class="text-3xl font-bold text-amber-600">0</p></div>
            <div class="bg-white p-6 rounded-xl shadow"><h3 class="text-gray-500">Treinos Hoje</h3><p class="text-3xl font-bold text-amber-600">0</p></div>
          </div>
          <h2 class="text-xl font-semibold mb-4">Bem-vindo, Administrador! 🐕</h2>
          <p>O sistema está pronto para uso. Comece cadastrando seus clientes e cães!</p>
        </main>
      </div>
    `
  },

  eventosAdmin() {
    document.getElementById('btnSair').addEventListener('click', async () => {
      await supabase.auth.signOut()
      this.user = null
      this.role = null
      this.tela = 'login'
      this.render()
    })
  },

  telaCliente() {
    return `
      <div class="min-h-screen bg-gray-50">
        <header class="bg-amber-600 text-white p-5 flex justify-between items-center">
          <h1 class="text-xl font-bold">🐕 S.Adestrador</h1>
          <button id="btnSairCliente" class="bg-white text-amber-600 px-4 py-2 rounded font-semibold">Sair</button>
        </header>
        <main class="p-5 max-w-lg mx-auto">
          <div class="bg-white rounded-xl shadow p-6 mb-6 text-center">
            <h2 class="text-2xl font-bold mb-2">Olá! 👋</h2>
            <p class="text-gray-600">Vamos treinar o seu cão hoje?</p>
          </div>
          <div class="bg-white rounded-xl shadow p-6 mb-6">
            <h3 class="font-bold text-lg mb-4">🎯 Treino de Hoje</h3>
            <p class="text-gray-500">Aguardando o adestrador liberar o treino...</p>
          </div>
          <div class="bg-white rounded-xl shadow p-6">
            <h3 class="font-bold text-lg mb-4">📊 Meu Progresso</h3>
            <p class="text-gray-500">Sem dados ainda. Comece a treinar!</p>
          </div>
        </main>
      </div>
    `
  },

  eventosCliente() {
    document.getElementById('btnSairCliente').addEventListener('click', async () => {
      await supabase.auth.signOut()
      this.user = null
      this.role = null
      this.tela = 'login'
      this.render()
    })
  }
}

App.init()
