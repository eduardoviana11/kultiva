import { CROPS_DICTIONARY, capitalizeLabel } from "../data/cropsDictionary";
import { PESTS_DICTIONARY, type PestOption } from "../data/pestsDictionary";
import type { CropHistoryData, CropOption } from "../features/onboarding/types/cropHistory.types";
import type { PriorityId } from "../features/onboarding/types/priority.types";
import type { SoilTypeId } from "../features/onboarding/types/soilType.types";
import type { WaterDistributionId } from "../features/onboarding/types/waterDistribution.types";

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8000/api/v1";

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");
export const DEFAULT_USUARIO_ID = 1;

export interface CoordenadaApi {
  lat: number;
  lng: number;
}

export interface TerrenoCreatePayload {
  nome_propriedade: string;
  usuario_id: number;
  coordenadas_poligono: CoordenadaApi[];
  area_hectares?: number;
  localizacao_central?: CoordenadaApi;
  prioridades?: Record<string, unknown>;
}

export interface TerrenoUpdatePayload {
  nome_propriedade?: string;
  usuario_id?: number;
  coordenadas_poligono?: CoordenadaApi[];
  area_hectares?: number;
  localizacao_central?: CoordenadaApi;
  prioridades?: Record<string, unknown>;
}

export interface TerrenoResponse {
  id: number;
  nome_propriedade: string;
  usuario_id: number;
  coordenadas_poligono: CoordenadaApi[];
  area_hectares?: number | null;
  localizacao_central?: CoordenadaApi | null;
  prioridades?: Record<string, unknown> | null;
}

export interface EstrategiaRotacaoSugerida {
  strategy: string;
  viability: number;
  water_risk: string;
  benefits?: string | null;
  score_breakdown?: Record<string, unknown> | null;
  explicacao?: string | null;
}

export interface EtapaRotacaoSimulada {
  ordem: number;
  cultura: string;
  duracao_dias: number;
  consumo_agua_estimado_mm: number;
  viabilidade_score: number;
  risco_hidrico: string;
}

export interface SimulacaoRequestPayload {
  terreno_id?: number;
  nome_propriedade?: string;
  coordenadas_poligono?: CoordenadaApi[];
  cultura_id?: number;
  nome_cultura?: string;
  culturas_rotacao?: string[];
  historico_cultivos?: string[] | Record<string, unknown>;
  perfil_climatico?: string;
  prioridades?: Record<string, unknown>;
  dados_solo?: Record<string, unknown>;
  dados_climaticos?: Record<string, unknown>;
  idioma?: "pt" | "en";
}

export interface SimulacaoResponse {
  terreno_id?: number | null;
  nome_propriedade: string;
  cultura_principal: string;
  viability_score: number;
  water_risk: string;
  tempo_colheita_dias: number;
  consumo_agua_mm: number;
  metricas_geoespaciais: Record<string, unknown>;
  beneficios_esperados: string[];
  riscos_identificados: string[];
  explicacao_ia: string;
  explicacao_textual: string;
  origem: string;
  fallback_usado: boolean;
  rotacoes_sugeridas: EstrategiaRotacaoSugerida[];
  plano_rotacao: EtapaRotacaoSimulada[];
}

export interface DemoSeedResponse {
  status: string;
  reset_executado: boolean;
  idempotente: boolean;
  usuario_id: number;
  terrenos_ids: number[];
  culturas_total: number;
  rotacoes_total: number;
  metricas_total: number;
  atividades_total: number;
  alertas_total: number;
  resumo: string;
}

export interface AtividadeCalendarioResponse {
  id: number;
  terreno_id?: number | null;
  usuario_id?: number | null;
  cultura_id?: number | null;
  titulo: string;
  descricao?: string | null;
  tipo_atividade: string;
  data_programada: string;
  prioridade: string;
  status: string;
  concluida: boolean;
  data_conclusao?: string | null;
  ajustada_por_alerta: boolean;
  motivo_ajuste?: string | null;
  criado_em?: string | null;
}

export interface AtividadeStatusPatch {
  concluida?: boolean;
  status?: string;
}

export interface EtapaCronogramaInput {
  ordem?: number;
  cultura: string;
  duracao_dias: number;
  risco_hidrico?: string;
}

export interface GerarCronogramaRequest {
  terreno_id: number;
  cultura_id?: number;
  nome_cultura?: string;
  data_inicio: string;
  tempo_colheita_dias?: number;
  estrategia_rotacao?: string;
  plano_rotacao?: EtapaCronogramaInput[];
  substituir_pendentes?: boolean;
}

export interface AlertaGatilhoRequest {
  terreno_id: number;
  tipo_evento: string;
  severidade?: string;
  data_evento: string;
  titulo?: string;
  mensagem?: string;
  origem_gatilho?: string;
  serie_temporal_clima?: Array<Record<string, unknown>>;
  dias_adiamento?: number;
  idioma?: "pt" | "en";
}

export interface AlertaClimaticoResponse {
  id: number;
  terreno_id: number;
  tipo_evento: string;
  severidade: string;
  titulo: string;
  mensagem: string;
  data_evento: string;
  origem_gatilho: string;
  dados_gatilho?: Record<string, unknown> | null;
  processado_background: boolean;
  resumo_adaptacao?: string | null;
  orientacao_pratica?: string | null;
  lido: boolean;
  criado_em: string;
}

export interface AlertaDisparoResponse {
  status: string;
  mensagem: string;
  alerta: AlertaClimaticoResponse;
}

export interface ResumoAlertasTerrenoItem {
  terreno_id: number;
  nome_propriedade?: string | null;
  nao_lidos: number;
  criticos_nao_lidos: number;
  ultimo_evento?: string | null;
  ultima_data_evento?: string | null;
}

export interface ResumoAlertasNaoLidosResponse {
  total_nao_lidos: number;
  por_terreno: ResumoAlertasTerrenoItem[];
}

export interface MetricaHistoricaCreate {
  data_medicao: string;
  soil_moisture: number;
  surface_temp_c: number;
  precipitation_mm?: number;
  is_bare_field_period?: boolean;
  data_quality?: string;
  origem?: string;
}

export interface MetricaHistoricaResponse {
  id: number;
  terreno_id: number;
  data_medicao: string;
  soil_moisture: number;
  surface_temp_c: number;
  precipitation_mm: number;
  is_bare_field_period: boolean;
  data_quality: string;
  origem: string;
  criado_em: string;
}

export interface ResumoClimaticoRelatorio {
  umidade_media_solo: number;
  umidade_min_solo: number;
  umidade_max_solo: number;
  temperatura_media_c: number;
  temperatura_max_c: number;
  precipitacao_total_mm: number;
  precipitacao_media_mm: number;
  dias_solo_exposto: number;
  total_medicoes: number;
}

export interface VigorTerrenoResumo {
  indice: number;
  classificacao: string;
  tendencia: string;
  descricao: string;
}

export interface VulnerabilidadeTerrenoResumo {
  indice: number;
  nivel: string;
  total_alertas_periodo: number;
  eventos_criticos: string[];
  fatores_risco: string[];
}

export interface AdaptacaoAtividadeItem {
  atividade_id: number;
  titulo: string;
  tipo_atividade: string;
  data_programada: string;
  prioridade: string;
  status: string;
  motivo_ajuste?: string | null;
}

export interface AdaptacoesTerrenoResumo {
  total_atividades_periodo: number;
  total_ajustadas_por_alerta: number;
  taxa_adaptacao: number;
  atividades_ajustadas: AdaptacaoAtividadeItem[];
}

export interface AlertaResumoRelatorio {
  id: number;
  tipo_evento: string;
  severidade: string;
  titulo: string;
  data_evento: string;
  processado_background: boolean;
  resumo_adaptacao?: string | null;
}

export interface ComparativoPeriodoRelatorio {
  data_inicial?: string | null;
  data_final?: string | null;
  umidade_inicial: number;
  umidade_final: number;
  variacao_umidade: number;
  variacao_umidade_percentual: number;
  temperatura_inicial_c: number;
  temperatura_final_c: number;
  variacao_temperatura_c: number;
  precipitacao_inicial_mm: number;
  precipitacao_final_mm: number;
  variacao_precipitacao_mm: number;
  tendencia_geral: string;
  resumo_comparativo: string;
}

export interface RelatorioAdaptacaoResponse {
  terreno_id: number;
  nome_propriedade: string;
  periodo_inicio: string;
  periodo_fim: string;
  origem_dados: string;
  resumo_climatico: ResumoClimaticoRelatorio;
  vigor: VigorTerrenoResumo;
  vulnerabilidade: VulnerabilidadeTerrenoResumo;
  adaptacoes: AdaptacoesTerrenoResumo;
  alertas_periodo: AlertaResumoRelatorio[];
  serie_historica: MetricaHistoricaResponse[];
  recomendacoes_manejo: string[];
  comparativo_periodo: ComparativoPeriodoRelatorio;
  resumo_ia: string;
  explicacao_ia: string;
}

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

const COLD_START_STATUSES = new Set([502, 503, 504]);

function markApiReachable(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kultiva-api-reachable"));
  }
}

async function fetchWithColdStartRetry(
  url: string,
  init?: RequestInit,
  allowPostColdStartRetry = false
): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase();
  const maxRetries =
    method === "GET" || (allowPostColdStartRetry && method === "POST") ? 2 : 0;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetch(url, init);
    if (response.status < 500) {
      markApiReachable();
    }
    if (!COLD_START_STATUSES.has(response.status) || attempt === maxRetries) {
      return response;
    }
    const online = typeof navigator === "undefined" || navigator.onLine;
    if (!online || init?.signal?.aborted) {
      return response;
    }
    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
  }

  return fetch(url, init);
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
  retryOnColdStart = false
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetchWithColdStartRetry(
    `${API_BASE_URL}${normalizedPath}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    },
    retryOnColdStart
  );

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const errorBody = (await response.json()) as { detail?: unknown };
      if (typeof errorBody?.detail === "string") {
        detail = errorBody.detail;
      }
    } catch {
      // Resposta sem payload JSON estruturado
    }
    throw new ApiError(
      detail || `Erro na API (${response.status})`,
      response.status,
      detail
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

const DEVICE_ID_STORAGE_KEY = "kultiva_device_id";
const DEVICE_USER_STORAGE_KEY = "kultiva_device_user";
const DEVICE_OWNED_TERRENOS_STORAGE_KEY = "kultiva_device_owned_terrenos";

interface StoredDeviceUser {
  deviceId: string;
  apiBaseUrl: string;
  usuarioId: number;
}

type StoredOwnedTerrenosMap = Record<string, number[]>;

let resolvedSessionUsuarioId: number | null = null;
let sessionEndpointUnsupported = false;
let inFlightUsuarioSession: Promise<number> | null = null;

function readStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignora falha de armazenamento em modo privado/quota
  }
}

function ownedScopeKey(deviceId: string): string {
  return `${API_BASE_URL}::${deviceId}`;
}

function readOwnedTerrenosMap(): StoredOwnedTerrenosMap {
  const raw = readStorageItem(DEVICE_OWNED_TERRENOS_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as StoredOwnedTerrenosMap;
    }
  } catch {
    // Cache inválido ignorado
  }
  return {};
}

function readOwnedTerrenoIds(deviceId = getOrCreateDeviceId()): number[] {
  const list = readOwnedTerrenosMap()[ownedScopeKey(deviceId)];
  if (!Array.isArray(list)) return [];
  return Array.from(
    new Set(
      list.filter(
        (id): id is number =>
          typeof id === "number" && Number.isInteger(id) && id > 0
      )
    )
  );
}

function writeOwnedTerrenoIds(ids: number[], deviceId = getOrCreateDeviceId()): void {
  const map = readOwnedTerrenosMap();
  const key = ownedScopeKey(deviceId);
  if (ids.length === 0) {
    delete map[key];
  } else {
    map[key] = Array.from(new Set(ids));
  }
  writeStorageItem(DEVICE_OWNED_TERRENOS_STORAGE_KEY, JSON.stringify(map));
}

export function registrarTerrenoDoDispositivo(terrenoId: number): void {
  if (!Number.isInteger(terrenoId) || terrenoId <= 0) return;
  const current = readOwnedTerrenoIds();
  if (!current.includes(terrenoId)) {
    writeOwnedTerrenoIds([...current, terrenoId]);
  }
}

export function removerTerrenoDoDispositivo(terrenoId: number): void {
  const current = readOwnedTerrenoIds();
  if (current.includes(terrenoId)) {
    writeOwnedTerrenoIds(current.filter((id) => id !== terrenoId));
  }
}

export function getOrCreateDeviceId(): string {
  const existing = readStorageItem(DEVICE_ID_STORAGE_KEY);
  if (existing && /^[a-z0-9_-]{8,128}$/i.test(existing.trim())) {
    return existing.trim().toLowerCase();
  }

  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().toLowerCase()
      : `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

  writeStorageItem(DEVICE_ID_STORAGE_KEY, generated);
  return generated;
}

function readCachedDeviceUsuarioId(deviceId: string): number | null {
  const raw = readStorageItem(DEVICE_USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredDeviceUser>;
    if (
      parsed.deviceId === deviceId &&
      parsed.apiBaseUrl === API_BASE_URL &&
      typeof parsed.usuarioId === "number" &&
      Number.isInteger(parsed.usuarioId) &&
      parsed.usuarioId > 0
    ) {
      return parsed.usuarioId;
    }
  } catch {
    // Cache inválido ignorado
  }
  return null;
}

export function limparCacheUsuarioDispositivo(): void {
  resolvedSessionUsuarioId = null;
  sessionEndpointUnsupported = false;
  inFlightUsuarioSession = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(DEVICE_USER_STORAGE_KEY);
    } catch {
      // Ignora falha de armazenamento
    }
  }
}

export async function obterOuCriarUsuarioDispositivo(
  forceRefresh = false
): Promise<number> {
  if (!forceRefresh && resolvedSessionUsuarioId !== null) {
    return resolvedSessionUsuarioId;
  }

  if (!forceRefresh && inFlightUsuarioSession) {
    return inFlightUsuarioSession;
  }

  const deviceId = getOrCreateDeviceId();
  inFlightUsuarioSession = requestJson<{
    id: number;
    nome: string;
    device_id: string;
  }>(
    "/usuarios/sessao",
    {
      method: "POST",
      body: JSON.stringify({ device_id: deviceId }),
    },
    true
  )
    .then((session) => {
      sessionEndpointUnsupported = false;
      resolvedSessionUsuarioId = session.id;
      writeStorageItem(
        DEVICE_USER_STORAGE_KEY,
        JSON.stringify({
          deviceId,
          apiBaseUrl: API_BASE_URL,
          usuarioId: session.id,
        } satisfies StoredDeviceUser)
      );
      return session.id;
    })
    .catch((err) => {
      // Se o backend em deploy ainda não tiver /usuarios/sessao (404/405),
      // mantém compatibilidade com DEFAULT_USUARIO_ID + filtro local por dispositivo.
      if (err instanceof ApiError && (err.status === 404 || err.status === 405)) {
        sessionEndpointUnsupported = true;
        resolvedSessionUsuarioId = DEFAULT_USUARIO_ID;
        return DEFAULT_USUARIO_ID;
      }
      if (!forceRefresh && !(err instanceof ApiError)) {
        const cached = readCachedDeviceUsuarioId(deviceId);
        if (cached !== null) {
          resolvedSessionUsuarioId = cached;
          return cached;
        }
      }
      throw err;
    })
    .finally(() => {
      inFlightUsuarioSession = null;
    });

  return inFlightUsuarioSession;
}

export function listarTerrenos(usuarioId?: number): Promise<TerrenoResponse[]> {
  const query =
    usuarioId !== undefined ? `?usuario_id=${encodeURIComponent(usuarioId)}` : "";
  return requestJson<TerrenoResponse[]>(`/terrenos/${query}`);
}

export async function listarTerrenosDoDispositivo(): Promise<TerrenoResponse[]> {
  const usuarioId = await obterOuCriarUsuarioDispositivo();
  const ownedIds = readOwnedTerrenoIds();

  if (sessionEndpointUnsupported) {
    if (ownedIds.length === 0) return [];
    const terrenos = await listarTerrenos(DEFAULT_USUARIO_ID);
    const ownedSet = new Set(ownedIds);
    return terrenos.filter((terreno) => ownedSet.has(terreno.id));
  }

  let terrenos = await listarTerrenos(usuarioId);
  const loadedIds = new Set(terrenos.map((terreno) => terreno.id));
  const pendingMigration = ownedIds.filter((id) => !loadedIds.has(id));

  if (pendingMigration.length > 0) {
    let migratedAny = false;
    await Promise.all(
      pendingMigration.map(async (terrenoId) => {
        try {
          await atualizarTerreno(terrenoId, { usuario_id: usuarioId });
          migratedAny = true;
        } catch (err) {
          if (err instanceof ApiError && err.status === 404) {
            removerTerrenoDoDispositivo(terrenoId);
          }
        }
      })
    );
    if (migratedAny) {
      terrenos = await listarTerrenos(usuarioId);
    }
  }

  return terrenos;
}

export function buscarTerreno(
  terrenoId: number,
  usuarioId?: number
): Promise<TerrenoResponse> {
  const query =
    usuarioId !== undefined ? `?usuario_id=${encodeURIComponent(usuarioId)}` : "";
  return requestJson<TerrenoResponse>(`/terrenos/${terrenoId}${query}`);
}

export function criarTerreno(
  payload: TerrenoCreatePayload
): Promise<TerrenoResponse> {
  return requestJson<TerrenoResponse>("/terrenos/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function criarTerrenoParaDispositivo(
  payload: Omit<TerrenoCreatePayload, "usuario_id">
): Promise<TerrenoResponse> {
  const usuarioId = await obterOuCriarUsuarioDispositivo();
  try {
    const created = await criarTerreno({ ...payload, usuario_id: usuarioId });
    registrarTerrenoDoDispositivo(created.id);
    return created;
  } catch (err) {
    if (
      !sessionEndpointUnsupported &&
      err instanceof ApiError &&
      err.status === 404
    ) {
      limparCacheUsuarioDispositivo();
      const freshUsuarioId = await obterOuCriarUsuarioDispositivo(true);
      const created = await criarTerreno({
        ...payload,
        usuario_id: freshUsuarioId,
      });
      registrarTerrenoDoDispositivo(created.id);
      return created;
    }
    throw err;
  }
}

export function atualizarTerreno(
  terrenoId: number,
  payload: TerrenoUpdatePayload,
  usuarioId?: number
): Promise<TerrenoResponse> {
  const query =
    usuarioId !== undefined ? `?usuario_id=${encodeURIComponent(usuarioId)}` : "";
  return requestJson<TerrenoResponse>(`/terrenos/${terrenoId}${query}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function excluirTerreno(
  terrenoId: number,
  usuarioId?: number
): Promise<void> {
  const query =
    usuarioId !== undefined ? `?usuario_id=${encodeURIComponent(usuarioId)}` : "";
  return requestJson<void>(`/terrenos/${terrenoId}${query}`, {
    method: "DELETE",
  });
}

export function simularRotacao(
  payload: SimulacaoRequestPayload
): Promise<SimulacaoResponse> {
  return requestJson<SimulacaoResponse>("/simular-rotacao", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}

export function listarAtividades(params?: {
  terreno_id?: number;
  usuario_id?: number;
  status?: string;
  concluida?: boolean;
  tipo_atividade?: string;
  data_inicio?: string;
  data_fim?: string;
}): Promise<AtividadeCalendarioResponse[]> {
  const query = params ? buildQueryString(params) : "";
  return requestJson<AtividadeCalendarioResponse[]>(
    `/calendario/atividades${query}`
  );
}

export function gerarCronogramaDeSimulacao(
  payload: GerarCronogramaRequest
): Promise<AtividadeCalendarioResponse[]> {
  return requestJson<AtividadeCalendarioResponse[]>(
    "/calendario/gerar-de-simulacao",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function concluirAtividade(
  atividadeId: number,
  payload: AtividadeStatusPatch = { concluida: true }
): Promise<AtividadeCalendarioResponse> {
  return requestJson<AtividadeCalendarioResponse>(
    `/calendario/atividades/${atividadeId}/concluir`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export function listarAlertas(params?: {
  terreno_id?: number;
  lido?: boolean;
  severidade?: string;
  tipo_evento?: string;
}): Promise<AlertaClimaticoResponse[]> {
  const query = params ? buildQueryString(params) : "";
  return requestJson<AlertaClimaticoResponse[]>(`/alertas/${query}`);
}

export function obterResumoAlertasNaoLidos(
  terrenoId?: number
): Promise<ResumoAlertasNaoLidosResponse> {
  const query =
    terrenoId !== undefined ? buildQueryString({ terreno_id: terrenoId }) : "";
  return requestJson<ResumoAlertasNaoLidosResponse>(
    `/alertas/resumo-nao-lidos${query}`
  );
}

export function dispararAlertaGatilho(
  payload: AlertaGatilhoRequest
): Promise<AlertaDisparoResponse> {
  return requestJson<AlertaDisparoResponse>("/alertas/gatilho", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function marcarAlertaComoLido(
  alertaId: number
): Promise<AlertaClimaticoResponse> {
  return requestJson<AlertaClimaticoResponse>(`/alertas/${alertaId}/ler`, {
    method: "PATCH",
  });
}

export function obterRelatorioTerreno(
  terrenoId: number,
  params?: { data_inicio?: string; data_fim?: string }
): Promise<RelatorioAdaptacaoResponse> {
  const query = params ? buildQueryString(params) : "";
  return requestJson<RelatorioAdaptacaoResponse>(
    `/relatorios/terreno/${terrenoId}${query}`
  );
}

export function listarMetricasTerreno(
  terrenoId: number
): Promise<MetricaHistoricaResponse[]> {
  return requestJson<MetricaHistoricaResponse[]>(
    `/relatorios/terreno/${terrenoId}/metricas`
  );
}

export function registrarMetricaTerreno(
  terrenoId: number,
  payload: MetricaHistoricaCreate
): Promise<MetricaHistoricaResponse> {
  return requestJson<MetricaHistoricaResponse>(
    `/relatorios/terreno/${terrenoId}/metricas`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export function formatarAreaHectares(areaHectares?: number | null): string {
  if (
    areaHectares === undefined ||
    areaHectares === null ||
    Number.isNaN(areaHectares) ||
    areaHectares <= 0
  ) {
    return "Área a definir";
  }

  const isCloseToInt = Math.abs(areaHectares - Math.round(areaHectares)) < 0.05;
  const formatted = isCloseToInt
    ? String(Math.round(areaHectares))
    : areaHectares.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });

  const unit = Math.abs(areaHectares - 1) < 0.05 ? "hectare" : "hectares";
  return `${formatted} ${unit}`;
}

export function converterHistoricoParaLista(
  cropHistory?: CropHistoryData | null
): string[] {
  if (!cropHistory || cropHistory.naoLembro) {
    return [];
  }

  const lista: string[] = [];
  if (cropHistory.cultivoAnterior?.officialName) {
    lista.push(cropHistory.cultivoAnterior.officialName);
  }
  if (cropHistory.ultimoCultivo?.officialName) {
    lista.push(cropHistory.ultimoCultivo.officialName);
  }
  return lista;
}

const IRRIGATION_PRIORITY_MAP: Record<
  WaterDistributionId,
  { agua: "escassa" | "moderada" | "abundante"; water_conservation: boolean }
> = {
  chuva: { agua: "escassa", water_conservation: true },
  caminhao_pipa: { agua: "escassa", water_conservation: true },
  poco_caixa: { agua: "moderada", water_conservation: false },
  gotejamento: { agua: "moderada", water_conservation: true },
  aspersao: { agua: "abundante", water_conservation: false },
  sulco: { agua: "abundante", water_conservation: false },
};

export function mapearPrioridadesIrrigacao(
  metodoId: WaterDistributionId,
  cropHistory?: CropHistoryData | null
): Record<string, unknown> {
  const mapped = IRRIGATION_PRIORITY_MAP[metodoId];
  const prioridades: Record<string, unknown> = {
    agua: mapped.agua,
    water_conservation: mapped.water_conservation,
    metodo_irrigacao: metodoId,
  };

  if (cropHistory) {
    prioridades.historico_cultivos = converterHistoricoParaLista(cropHistory);
    prioridades.nao_lembra_historico = cropHistory.naoLembro;
    prioridades.cultivo_em_andamento = Boolean(cropHistory.cultivoEmAndamento);
    prioridades.data_inicio_cultivo =
      cropHistory.cultivoEmAndamento && cropHistory.dataInicioCultivo
        ? cropHistory.dataInicioCultivo
        : null;
  }

  return prioridades;
}

function findCropOptionByName(name: string): CropOption | null {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return null;

  return (
    CROPS_DICTIONARY.find(
      (item) =>
        item.officialName.toLowerCase() === normalized ||
        item.id.toLowerCase() === normalized ||
        item.popularNames.some((alias) => alias.toLowerCase() === normalized)
    ) ?? {
      id: normalized.replace(/\s+/g, "-"),
      officialName: name.trim(),
      popularNames: [name.trim()],
      imageUrl: null,
    }
  );
}

export function restaurarHistoricoDoTerreno(
  prioridades?: Record<string, unknown> | null
): Partial<CropHistoryData> | undefined {
  if (!prioridades) return undefined;

  const naoLembro = Boolean(prioridades.nao_lembra_historico);
  const cultivoEmAndamento = Boolean(prioridades.cultivo_em_andamento);
  const dataInicioCultivo =
    typeof prioridades.data_inicio_cultivo === "string" &&
    prioridades.data_inicio_cultivo.trim()
      ? prioridades.data_inicio_cultivo.trim()
      : null;
  const rawList = Array.isArray(prioridades.historico_cultivos)
    ? prioridades.historico_cultivos
        .map((item) => String(item).trim())
        .filter(Boolean)
    : [];

  if (!naoLembro && rawList.length === 0) {
    return undefined;
  }

  if (naoLembro) {
    return {
      ultimoCultivo: null,
      cultivoAnterior: null,
      naoLembro: true,
      cultivoEmAndamento: false,
      dataInicioCultivo: null,
    };
  }

  if (rawList.length === 1) {
    return {
      ultimoCultivo: findCropOptionByName(rawList[0]),
      cultivoAnterior: null,
      naoLembro: false,
      cultivoEmAndamento,
      dataInicioCultivo,
    };
  }

  return {
    cultivoAnterior: findCropOptionByName(rawList[rawList.length - 2]),
    ultimoCultivo: findCropOptionByName(rawList[rawList.length - 1]),
    naoLembro: false,
    cultivoEmAndamento,
    dataInicioCultivo,
  };
}

const VALID_WATER_IDS: WaterDistributionId[] = [
  "chuva",
  "poco_caixa",
  "caminhao_pipa",
  "gotejamento",
  "aspersao",
  "sulco",
];

export function extrairMetodoIrrigacao(
  prioridades?: Record<string, unknown> | null
): WaterDistributionId | null {
  if (!prioridades) return null;

  const metodo = prioridades.metodo_irrigacao;
  if (
    typeof metodo === "string" &&
    VALID_WATER_IDS.includes(metodo as WaterDistributionId)
  ) {
    return metodo as WaterDistributionId;
  }

  const agua = typeof prioridades.agua === "string" ? prioridades.agua.toLowerCase() : "";
  if (agua === "escassa" || agua === "baixa" || agua === "limitada") {
    return "chuva";
  }
  if (agua === "moderada") {
    return "poco_caixa";
  }
  if (agua === "abundante") {
    return "aspersao";
  }

  return null;
}

const VALID_SOIL_IDS: SoilTypeId[] = [
  "areia",
  "barro",
  "terra_preta",
  "cascalho",
  "terra_mista",
];

export function extrairTipoSolo(
  prioridades?: Record<string, unknown> | null
): SoilTypeId | null {
  if (!prioridades) return null;
  const raw = prioridades.tipo_solo;
  if (typeof raw === "string" && VALID_SOIL_IDS.includes(raw as SoilTypeId)) {
    return raw as SoilTypeId;
  }
  return null;
}

const VALID_PRIORITY_IDS: PriorityId[] = [
  "recuperar_terra",
  "retorno_rapido",
  "consumo_racao",
  "plantar_especifico",
  "gastar_minimo",
  "limpar_terra",
];

function findPestOptionByName(name: string): PestOption | null {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return null;

  return (
    PESTS_DICTIONARY.find(
      (item) =>
        item.officialName.toLowerCase() === normalized ||
        item.id.toLowerCase() === normalized ||
        item.popularNames.some((alias) => alias.toLowerCase() === normalized)
    ) ?? {
      id: normalized.replace(/\s+/g, "-"),
      officialName: name.trim(),
      popularNames: [name.trim()],
      category: "Outro",
    }
  );
}

export function extrairPrioridadeDoTerreno(
  prioridades?: Record<string, unknown> | null
): {
  priorityId: PriorityId | null;
  targetCrop: CropOption | null;
  targetPest: PestOption | null;
} {
  if (!prioridades) {
    return { priorityId: null, targetCrop: null, targetPest: null };
  }

  const rawPriority = prioridades.prioridade ?? prioridades.objetivo_principal;
  const priorityId =
    typeof rawPriority === "string" &&
    VALID_PRIORITY_IDS.includes(rawPriority as PriorityId)
      ? (rawPriority as PriorityId)
      : null;

  const targetCrop =
    typeof prioridades.cultura_desejada === "string" &&
    prioridades.cultura_desejada.trim()
      ? findCropOptionByName(prioridades.cultura_desejada)
      : null;

  const targetPest =
    typeof prioridades.praga_alvo === "string" && prioridades.praga_alvo.trim()
      ? findPestOptionByName(prioridades.praga_alvo)
      : null;

  return { priorityId, targetCrop, targetPest };
}

interface CulturaCatalogoApiItem {
  id: string;
  scientific_name: string;
  official_name: string;
  popular_names: string[];
  image_url?: string | null;
}

interface PragaCatalogoApiItem {
  id: string;
  official_name: string;
  popular_names: string[];
  scientific_name?: string | null;
  category?: string;
}

export async function buscarCulturasCatalogo(
  query = "",
  limit = 30,
  signal?: AbortSignal,
  lang: "pt" | "en" = "en"
): Promise<CropOption[]> {
  try {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: String(limit),
      lang,
    });
    const response = await fetch(
      `${API_BASE_URL}/culturas/catalogo/buscar?${params.toString()}`,
      {
        signal,
        headers: {
          "Accept-Language": lang === "en" ? "en-US,en;q=0.9" : "pt-BR,pt;q=0.9",
        },
      }
    );
    if (!response.ok) {
      return [];
    }
    markApiReachable();
    const data = (await response.json()) as CulturaCatalogoApiItem[];
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((item) => ({
      id: item.id,
      officialName: capitalizeLabel(item.official_name),
      popularNames: item.popular_names.map(capitalizeLabel),
      imageUrl: item.image_url ?? null,
    }));
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    return [];
  }
}

export async function buscarPragasCatalogo(
  query = "",
  limit = 30,
  signal?: AbortSignal,
  lang: "pt" | "en" = "en"
): Promise<PestOption[]> {
  try {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: String(limit),
      lang,
    });
    const response = await fetch(
      `${API_BASE_URL}/culturas/pragas/buscar?${params.toString()}`,
      {
        signal,
        headers: {
          "Accept-Language": lang === "en" ? "en-US,en;q=0.9" : "pt-BR,pt;q=0.9",
        },
      }
    );
    if (!response.ok) {
      return [];
    }
    markApiReachable();
    const data = (await response.json()) as PragaCatalogoApiItem[];
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((item) => ({
      id: item.id,
      officialName: capitalizeLabel(item.official_name),
      popularNames: item.popular_names.map(capitalizeLabel),
      category:
        item.category ?? (lang === "en" ? "Pest / Disease" : "Praga / Doença"),
    }));
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    return [];
  }
}
