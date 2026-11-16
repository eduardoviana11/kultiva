import * as React from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { KultivaLogo } from "../components/KultivaLogo";
import { LanguageSelector } from "../components/LanguageSelector";
import { NetworkStatusBadge } from "../components/NetworkStatusBadge";
import { Button } from "../components/ui/button";
import {
  type CoordenadaApi,
  type TerrenoResponse,
  excluirTerreno,
  formatarAreaHectares,
  listarTerrenosDoDispositivo,
  removerTerrenoDoDispositivo,
} from "../services/api";

export interface PlantationArea {
  id: string;
  name: string;
  sizeLabel: string;
  terrenoId?: number;
  usuarioId?: number;
  areaHectares?: number | null;
  coordenadasPoligono?: CoordenadaApi[];
  prioridades?: Record<string, unknown> | null;
}

function mapTerrenoToArea(terreno: TerrenoResponse): PlantationArea {
  return {
    id: String(terreno.id),
    terrenoId: terreno.id,
    usuarioId: terreno.usuario_id,
    name: terreno.nome_propriedade,
    sizeLabel: formatarAreaHectares(terreno.area_hectares),
    areaHectares: terreno.area_hectares ?? null,
    coordenadasPoligono: terreno.coordenadas_poligono,
    prioridades: terreno.prioridades ?? null,
  };
}

export interface PlantationsPageProps {
  onCreateArea?: () => void;
  onSelectArea?: (area: PlantationArea) => void;
  onAreaDeleted?: (area: PlantationArea) => void;
  simulationBanner?: React.ReactNode;
}

export function PlantationsPage({
  onCreateArea,
  onSelectArea,
  onAreaDeleted,
  simulationBanner,
}: PlantationsPageProps) {
  const [areas, setAreas] = React.useState<PlantationArea[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [areaToDelete, setAreaToDelete] = React.useState<PlantationArea | null>(
    null
  );

  const fetchAreas = React.useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const terrenos = await listarTerrenosDoDispositivo();
      setAreas(terrenos.map(mapTerrenoToArea));
    } catch (error) {
      setAreas([]);
      setApiError(
        error instanceof Error
          ? error.message
          : t("plantations.loadError")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchAreas();
  }, [fetchAreas]);

  const handleOpenDeleteModal = (area: PlantationArea) => {
    setAreaToDelete(area);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setAreaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return;
    setApiError(null);

    if (areaToDelete.terrenoId !== undefined) {
      setIsDeleting(true);
      try {
        await excluirTerreno(areaToDelete.terrenoId, areaToDelete.usuarioId);
        removerTerrenoDoDispositivo(areaToDelete.terrenoId);
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : t("plantations.deleteError")
        );
        setIsDeleting(false);
        return;
      } finally {
        setIsDeleting(false);
      }
    }

    const removedArea = areaToDelete;
    setAreas((prev) => prev.filter((item) => item.id !== removedArea.id));
    setDeleteModalOpen(false);
    setAreaToDelete(null);
    onAreaDeleted?.(removedArea);
  };

  const { t } = useTranslation();
  const formattedCount = String(areas.length).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#F7F6F0] md:bg-[#EFECE3] md:py-6">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-between bg-[#F7F6F0] px-5 pt-7 pb-8 text-[#1F1C18] md:min-h-[820px] md:rounded-[32px] md:border md:border-[#E6E4DA] md:shadow-sm">
        <div>
          <header className="flex items-center justify-between gap-2">
            <KultivaLogo />

            <div className="flex items-center gap-2">
              <NetworkStatusBadge />
              <button
                type="button"
                onClick={() => void fetchAreas()}
                disabled={isLoading}
                aria-label={t("plantations.refreshAria")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E6E4DA] bg-white text-[#511D4E] transition-colors hover:bg-[#EFECE3] disabled:opacity-50"
              >
                <RefreshCw
                  className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                  aria-hidden="true"
                />
              </button>

              <LanguageSelector />
            </div>
          </header>

          <section className="mt-7">
            <h1 className="text-[32px] font-bold tracking-tight text-[#511D4E] leading-tight">
              {t("plantations.title")}
            </h1>
          </section>

          {apiError && (
            <div
              role="alert"
              className="mt-4 rounded-2xl border border-[#C42311]/30 bg-[#C42311]/10 px-4 py-3 text-xs font-medium text-[#C42311]"
            >
              {apiError}
            </div>
          )}

          {simulationBanner && <div className="mt-5">{simulationBanner}</div>}

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.08em] text-[#6D6960] uppercase">
                {t("plantations.registeredAreas")}
              </span>
              <span className="text-[14px] font-bold text-[#511D4E]">
                {formattedCount}
              </span>
            </div>

            {isLoading && areas.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-[#E6E4DA] bg-white/70 px-4 py-8 text-center text-sm text-[#6D6960]">
                {t("plantations.loadingAreas")}
              </div>
            ) : areas.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {areas.map((area) => (
                  <li
                    key={area.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6E4DA] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(31,28,24,0.03)]"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectArea?.(area)}
                      className="min-w-0 flex-1 text-left focus-visible:outline-none"
                    >
                      <p className="truncate text-[16px] font-bold text-[#1F1C18]">
                        {area.name}
                      </p>
                      <p className="mt-1 text-[14px] text-[#6D6960]">
                        {area.sizeLabel}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(area)}
                      aria-label={t("plantations.deleteAria", { name: area.name })}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      <Trash2 className="h-[18px] w-[18px]" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-[#E6E4DA] bg-white/70 px-4 py-8 text-center">
                <p className="text-[15px] font-semibold text-[#1F1C18]">
                  {t("plantations.emptyTitle")}
                </p>
                <p className="mt-1 text-[13px] text-[#6D6960]">
                  {t("plantations.emptySubtitle")}
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="mt-8 flex flex-col gap-2.5 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onCreateArea}
            className="w-full"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("plantations.createNewArea")}
          </Button>
        </footer>
      </div>

      <AlertDialog
        open={deleteModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelDelete();
          } else {
            setDeleteModalOpen(true);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-lg font-extrabold text-red-600"
              aria-hidden="true"
            >
              !
            </div>
            <AlertDialogTitle className="mt-4 text-[22px] font-bold text-[#1F1C18]">
              {t("plantations.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-[14px] leading-relaxed text-[#6D6960]">
              {t("plantations.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleConfirmDelete()}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? t("plantations.deleting") : t("plantations.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
