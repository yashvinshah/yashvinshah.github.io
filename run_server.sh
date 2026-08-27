#!/bin/zsh
# Use Homebrew Ruby 3.3 — macOS system Ruby cannot install gems.
export PATH="/opt/homebrew/opt/ruby@3.3/bin:/opt/homebrew/lib/ruby/gems/3.3.0/bin:$PATH"
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
bundle exec jekyll serve --livereload
