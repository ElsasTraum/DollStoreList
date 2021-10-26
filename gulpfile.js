var gulp = require("gulp");
var sass = require('gulp-sass')(require('sass'));
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var autoprefixerOptions = {};
var slim = require("gulp-slim");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var newer = require("gulp-newer");

var paths = {
    html: {
        input: "src/slim/**/*.slim",
        output: "dist/",
    },
    styles: {
        input: "src/scss/**/*.scss",
        output: "dist/css/",
    },
};


// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

// SASS to CSS
function style() {
    return gulp
        .src(paths.styles.input)
        .pipe(sourcemaps.init()) // 初始化 sourcemaps
        .pipe(
            sass({
                outputStyle: "compressed",
            }).on("error", sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("./")) // 生成 sourcemaps 文件 (.map)
        .pipe(gulp.dest(paths.styles.output))
}

// SLIM to HTML (for all pages)

function htmlPage() {
    return gulp
        .src([paths.html.input, "!src/slim/includes/**"])
        .pipe(
            newer({
                dest: paths.html.output,
                ext: ".html",
            })
        )
        .pipe(
            slim({
                pretty: true,
                options: "encoding='utf-8'",
                require: "slim/include", // 呼叫include plug-in
                format: "xhtml",
                options: 'include_dirs=["src/slim/includes/"]',
            })
        )
        .pipe(gulp.dest(paths.html.output))
}

// SLIM to HTML (for include)

function htmlInclude() {
    return gulp
        .src([paths.html.input, "!src/slim/includes/**"])
        .pipe(
            slim({
                pretty: true,
                options: "encoding='utf-8'",
                require: "slim/include", // 呼叫include plug-in
                format: "xhtml",
                options: 'include_dirs=["src/slim/includes/"]',
            })
        )
        .pipe(gulp.dest(paths.html.output))
}


// BrowserSync Reload
function browserSyncReload() {
    browserSync.reload();
}

// Watch scss AND html files, doing different things with each.
gulp.task('default', function() {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch(paths.styles.input, style);
    gulp.watch(paths.html.input, htmlPage);
    gulp.watch(["src/slim/includes/*.slim"], htmlInclude);
    gulp.watch(
        ["./dist/js/**/*", "./dist/images/**/*", "./dist/fonts/**/*"],
        browserSyncReload
    );

    var html = gulp.watch('./dist/**.html');
    html.on('change', function(path, stats) {
        console.log('you changed the html');
        browserSync.notify("Compiling, please wait!");
        browserSync.reload("**.html");
    })

    var img = gulp.watch('./dist/img/**/');
    img.on('change', function(path, stats) {
        console.log('you changed the image');
        browserSync.notify("Compiling, please wait!");
        browserSync.reload();
    })

    var css = gulp.watch('./dist/css/**/*.css');
    css.on('change', function(path, stats) {
        console.log('you changed the css');
        browserSync.notify("Injecting CSS!");
        browserSync.reload("*.css");
    })
});