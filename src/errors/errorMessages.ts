export const ERROR_MESSAGES: Record<string | number, string> = {
  400: "Requisição inválida.",
  401: "Usuário ou senha incorretos.",
  403: "Você não tem permissão para isso.",
  404: "Recurso não encontrado.",
  408: "Tempo de resposta esgotado.",
  409: "Conflito de dados.",
  422: "Dados inválidos. Verifique os campos.",
  500: "Erro interno do servidor.",
  502: "Servidor indisponível.",
  503: "Serviço temporariamente indisponível.",

  NETWORK_ERROR: "Erro de conexão. Verifique sua internet.",
  UNKNOWN: "Erro inesperado. Tente novamente.",
};

export const ERROR_TRANSLATE: Record<string | number, string> = {
  'Invalid credentials': 'Credenciais inválidas'
}