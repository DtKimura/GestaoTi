# Frontend - Sistema de Gestão TI

Frontend moderno desenvolvido com React e Vite para o Sistema de Gestão TI.

## 📋 Estrutura do Projeto

```
frontEnd/
├── src/
│   ├── main.jsx          # Entry point da aplicação
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos do App
│   └── index.css         # Estilos globais
├── index.html            # Template HTML
├── vite.config.js        # Configuração do Vite
├── package.json          # Dependências do projeto
└── .gitignore            # Arquivos a ignorer no git
```

## 🚀 Como Executar

### Instalação de Dependências
```bash
cd frontEnd
npm install
```

### Executar em Modo de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

## 🔌 Integração com Backend

O Vite está configurado com proxy para integração com o backend:
- **URL do Backend**: `http://localhost:5000`
- **Requisições para `/api`** são redirecionadas para o backend

Exemplo de uso:
```javascript
const response = await fetch('/api/equipamentos')
```

## 📚 Dependências

- **React**: Biblioteca UI
- **React DOM**: Renderização no DOM
- **Axios**: Cliente HTTP (opcional, use fetch se preferir)
- **Vite**: Bundler/Build tool

## 📝 Notas

- A aplicação está pronta para desenvolver componentes
- Dashboard com cards para estatísticas
- Navegação básica implementada
- Estilos responsivos incluídos
