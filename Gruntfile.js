module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt, {
    pattern: ['assemble', 'grunt-*'],
    scope: ['devDependencies']
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assemble: {
      options: {
        assets: '<%= connect.site.options.base %>/assets',
        data: ['bower.json', 'src/data/*.json'],
        helpers: 'src/templates/helpers/helper-*.js',
        layoutdir: 'src/templates/layouts',
        partials: [
          'src/templates/layouts/*.hbs',
          'src/templates/partials/*.hbs'],
        layout: 'default.hbs',
        language: grunt.option('language') || 'en',
        flatten: true
      },
      indices: {
        options: {
          data: ['src/data/index/*.{yml,json}'],
          layout: 'index.hbs'
        },
        src: ['src/templates/site/*.hbs'],
        dest: '<%= connect.site.options.base %>/'
      }
    },
    autoprefixer: {
      dist: {
        expand: true,
        flatten: true,
        src: 'tmp/css/*.css',
        dest: 'dist/css/'
      },
      site: {
        src: '<%= assemble.options.assets %>/css/*.css'
      }
    },
    clean: {
      all: ['dist', 'tmp']
    },
    connect: {
      options: {
        hostname: grunt.option('connect-hostname') || 'localhost',
        port: 9000
      },
      site: {
        options: {
          base: 'tmp/assemble/<%= pkg.name %>',
          livereload: true,
          open: true
        }
      }
    },
    copy: {
      assets: {
        files: [
          {
            expand: true,
            cwd: 'src/assets',
            src: ['**/*'],
            dest: '<%= connect.site.options.base %>/assets/',
            filter: 'isFile'
          }
        ]
      }
    },
    csslint: {
      options: grunt.file.readYAML('csslint.yml'),
      site: {
        src: ['<%= autoprefixer.site.src %>']
      },
      dist: {
        formatters: [
          { id: 'junit-xml', dest: 'dist/report/csslint_junit.xml'},
          { id: 'csslint-xml', dest: 'dist/report/csslint.xml'}
        ],
        src: ['<%= autoprefixer.dist.dest %>*.css']
      }
    },
    'gh-pages': {
      options: {
        base: '<%= connect.site.options.base %>'
      },
      src: '**/*'
    },
    jshint: {
      options: grunt.file.readYAML('jshint.yml'),
      configurations: ['Gruntfile.js', 'package.json']
    },
    less: {
      site: {
        options: {
          sourceMap: true,
          outputSourceFiles: true,
          modifyVars: {}
        },
        files: [
          {
            expand: true,
            cwd: 'src/less/site',
            src: ['**/!(_)*.less'],
            dest: '<%= assemble.options.assets %>/css/',
            ext: '.css'
          }
        ]
      }
    },
    release: {
      options: {
        file: 'bower.json'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      asset: {
        files: ['src/assets/**/*'],
        tasks: ['newer:copy:assets']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['site']
      },
      json: {
        files: ['src/data/**/*.{json,yml}'],
        tasks: ['newer:jshint', 'assemble']
      },
      less: {
        files: 'src/less/**/*.less',
        tasks: ['less', 'newer:autoprefixer:site']
      },
      template: {
        files: 'src/templates/**/*.{js,hbs}',
        tasks: ['assemble']
      }
    }
  });

  grunt.registerTask('default', []);
  grunt.task.registerTask('test', [
    'clean', 'newer:jshint', 'less', 'autoprefixer', 'newer:csslint']);
  grunt.task.registerTask('build', [
    'clean', 'jshint', 'less', 'autoprefixer:dist', 'csslint:dist']);
  grunt.task.registerTask('site', [
    'clean', 'jshint', 'less:site', 'autoprefixer:site', 'csslint:site',
    'assemble', 'newer:copy:assets']);
  grunt.registerTask('deploy', ['site', 'gh-pages']);
  grunt.registerTask('live', ['site', 'connect:site', 'watch']);
};
