{ pkgs ? import <nixpkgs> {} }:

let
  nvmVersion = "0.38.0";
in

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.git
  ];

  shellHook = ''
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  '';

  # Install nvm
  postShellHooks = ''
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v${nvmVersion}/install.sh | bash
  '';
}
