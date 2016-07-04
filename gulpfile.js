"use strict";

const gulp = require('gulp');
const jade = require('gulp-jade');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const template = require('gulp-underscore-template');

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
let jadeConstant = require('./constant.js');

gulp.task('jade', function() {
  return gulp.src(sourceDir + '/jade/[^_]*.jade')
    .pipe(jade({
      pretty: true,
      locals: {
        css3Cons: jadeConstant.css3Cons
      }
    }))
    .pipe(gulp.dest(targetDir))
    .pipe(browserSync.stream({
      match: '**/*.html'
    }))
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

gulp.task('pcss', function() {
  return gulp.src(sourceDir + '/postcss/*.pcss')
    .pipe(postcss(processors, {
      parser: scss
    }))
    .pipe(rename({
      extname: '.css'
    }))
    .pipe(gulp.dest(targetDir + '/dist/css'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
})

gulp.task('template', function(){
  return gulp.src(sourceDir + '/template/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true
    }))
    .pipe(template())
    .pipe(gulp.dest(targetDir + '/dist/template'))
    .pipe(browserSync.stream({
      match: '**/*.js'
    }))
})

gulp.task('default', ['jade', 'pcss', 'template'], function() {
  browserSync.init({
    server: {
      index: 'index.html'
    }

  });
  gulp.watch(sourceDir + '/jade/*.jade', ['jade']);
  gulp.watch(sourceDir + '/postcss/*.pcss', ['pcss']);
  gulp.watch(sourceDir + '/template/*.html', ['template']);
  gulp.watch('./index.html').on('change', browserSync.reload)
})
