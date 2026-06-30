#!/usr/bin/env Rscript
# Genera el informe de indicadores estudiantiles.
# Uso: Rscript r_reports/generate_report.R

# Agregar pandoc al PATH si está en ~/.local/bin
local_bin <- file.path(Sys.getenv("HOME"), ".local", "bin")
if (dir.exists(local_bin) && !grepl(local_bin, Sys.getenv("PATH"), fixed = TRUE)) {
  Sys.setenv(PATH = paste(local_bin, Sys.getenv("PATH"), sep = ":"))
}

args <- commandArgs(trailingOnly = FALSE)

script_arg <- grep("--file=", args, value = TRUE)
if (length(script_arg) > 0) {
  script_path <- normalizePath(sub("--file=", "", script_arg[1]))
  script_dir <- dirname(script_path)
} else {
  script_dir <- getwd()
}

rmd_file <- file.path(script_dir, "informe_indicadores.Rmd")
output_dir <- file.path(script_dir, "output")

if (!file.exists(rmd_file)) {
  stop("No se encontró informe_indicadores.Rmd en: ", rmd_file)
}

dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

cat("Generando informe de indicadores...\n")
cat("Archivo Rmd:", rmd_file, "\n")
cat("Directorio de salida:", output_dir, "\n\n")

rmarkdown::render(
  input = rmd_file,
  output_dir = output_dir,
  quiet = FALSE
)

cat("\n¡Informe generado exitosamente!\n")
cat("Archivos en:", output_dir, "\n")
