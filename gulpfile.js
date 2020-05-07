var { src, dest, series, watch, task } = require("gulp");
var browserSync = require("browser-sync").create();
var hash = require("gulp-hash");
var references = require("gulp-hash-references");
var autoprefixer = require("gulp-autoprefixer");
var csso = require("gulp-csso");
var htmlmin = require("gulp-htmlmin");
var ghPages = require("gulp-gh-pages");
var del = require("del");

const AUTOPREFIXER_BROWSERS = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10",
];

//wipes dist for clean slate, used for clean up any leftover unwanted artifacts( usually made in hashing process )
task("clean", () => del(["./app/dist", "asset-manifest.json"]));

function styles() {
  return (
    src("./app/src/css/style.css")
      // Auto-prefix css styles for cross browser compatibility
      .pipe(autoprefixer({ overrideBrowserslist: AUTOPREFIXER_BROWSERS }))
      .pipe(csso())
      .pipe(hash()) // Generate hashes for the CSS files
      .pipe(dest("app/dist/css/")) // Save the renamed CSS files (e.g. style.123456.css)
      .pipe(hash.manifest("asset-manifest.json")) // Generate a manifest file
      .pipe(dest("."))
  ); // Save the manifest file
}

function resolve_pages() {
  return src(["./app/index.html"])
    .pipe(references("asset-manifest.json")) // Replace file paths in index.html according to the manifest
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest("app/dist")); // Save the renamed CSS files (e.g. style.123456.css)
}

function deploy() {
  return src("./app/dist/**/*").pipe(
    ghPages("https://github.com/rodericasm/portfolio.git")
  );
}

function dev() {
  browserSync.init({
    server: {
      baseDir: "./app/",
    },
  });
  watch("app/src/css/**/*.css").on("change", browserSync.reload);
  watch("app/**/*.html").on("change", browserSync.reload);
}

exports.deploy = series(task("clean"), styles, resolve_pages, deploy);
exports.build = series(task("clean"), styles, resolve_pages);
exports.dev = dev;
