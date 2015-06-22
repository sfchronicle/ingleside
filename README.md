# Project base
A simple flask scaffold for building client-side news graphics and applications. Includes:

- Livereload for fast development
- Grunt tasks for serving application
- Jinja2 for sane templating
- Frozen-Flask for creating static projects

### Requirements
- Python 2.7.x
- Node.js 0.12
- Bower and Grunt ($ npm install -g grunt-cli bower)

### Installation
```bash
$ git clone git@github.com:sfchronicle/project-base.git $PROJECT_NAME
$ cd $PROJECT_NAME
$ mkvirtualenv $PROJECT_NAME
$ pip install -r requirements && npm install && bower install
$ grunt serve  # visit localhost:5000 in your browser
```

## Structure

Coming soon.

## Deployment

Coming soon.

## Contributing

1. Fork it.
2. Create a branch (`git checkout -b username-patch-n`)
3. Commit your changes (`git commit -am "Added support for MovableType"`)
4. Push to the branch (`git push origin username-patch-n`)
5. Open a [Pull Request](http://github.com/github/markup/pulls)
6. Enjoy some [artisanal toast](https://www.eater.com/2014/5/30/6215971/artisanal-toast-is-taking-the-nation-by-storm)



## License
The MIT License (MIT)

Copyright The San Francisco Chronicle from '93 'til ...

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
