{ pkgs ? import <nixpkgs> {} }:

let
  nvmVersion = "0.38.0";
in

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.git
  ];

  # Install nvm
  shellHook = ''
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

    # Load nvm into shell environment
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

    # install nodejs (16 to avoid errors in the next step)
    nvm install 16

    # install yarn
    npm install -g yarn

    # update yarn
    npm update

    printf '%s\n' \
'=========================================' \
'Now you have a Nix environment with NodeJS v16 plus Yarn.' \
'You can run the following for your development setup:' \
'$ # Install dependencies' \
'$ yarn install' \
'$ # Serve locally (by default on port 8080)' \
'$ yarn dev'

  '';
}
