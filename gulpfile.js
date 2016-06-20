"use strict";

const gulp = require('gulp');
const jade = require('gulp-jade');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

const postcss = require('gulp-postcss');
const scss = require('postcss-scss');
const atImport = require('postcss-import');
const extend = require('postcss-extend');
const mixins = require('postcss-mixins');
const autoprefixer = require('autoprefixer');
const functions = require('postcss-functions');
const calc = require('postcss-calc');
const nested = require('postcss-nested');


let sourceDir = './_source';
let targetDir = '.';

gulp.task('jade', function(){
  return gulp.src(sourceDir + '/jade/[^_]*.jade')
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest(targetDir))
  .pipe(browserSync.stream({match: '**/*.html'}))
});

const processors = [
  atImport(),
  mixins(),
  nested(),
  extend(),
  calc(),
  autoprefixer({
    browsers: [
    'ie >= 7',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 12.1',
    'ios >= 6',
    'android >= 4.4',
    'and_uc 9.9'
  ],
  cascade: false
  })
]

gulp.task('pcss', function(){
  return gulp.src(sourceDir + '/postcss/*.pcss')
  .pipe(postcss(processors, {parser: scss}))
  .pipe(rename({
    extname: '.css'
  }))
  .pipe(gulp.dest(targetDir + '/css'))
  .pipe(browserSync.stream({match: '**/*.css'}));
  })


gulp.task('default', ['jade', 'pcss'], function(){
  browserSync.init({
    server:{
      index: 'index.html'
    }

  });
  gulp.watch(sourceDir + '/jade/*.jade',['jade']);
  gulp.watch(sourceDir + '/postcss/*.pcss',['pcss']);
  gulp.watch('./index.html').on('change', browserSync.reload)
})
