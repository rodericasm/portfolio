var { src, dest, series, watch, task } = require("gulp");
var browserSync = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var csso = require("gulp-csso");
var htmlmin = require("gulp-htmlmin");
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

//this project uses travis, no build gulp required, just push to master.
//wipes dist for clean slate, used for clean up any leftover unwanted artifacts( usually made in hashing process )
task("clean", () => del(["./app/dist"]));

function styles() {
  return (
    src("./app/css/style.css")
      // Auto-prefix css styles for cross browser compatibility
      .pipe(autoprefixer({ overrideBrowserslist: AUTOPREFIXER_BROWSERS }))
      .pipe(csso()) // Minify
      .pipe(dest("app/dist/css/")) // Save the renamed CSS files (e.g. style.123456.css)
      .pipe(dest("."))
  ); // Save the manifest file
}

function resolve_pages() {
  return src(["./app/index.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest("app/dist")); // Save the renamed CSS files (e.g. style.123456.css)
}

function dev() {
  browserSync.init({
    server: {
      baseDir: "./app/",
    },
  });
  watch("app/css/**/*.css").on("change", browserSync.reload);
  watch("app/**/*.html").on("change", browserSync.reload);
}

exports.build = series(task("clean"), styles, resolve_pages);
exports.dev = dev;
