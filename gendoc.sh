#!/bin/bash -eu

shopt -s expand_aliases

function clone_or_pull {
  remote=$1
  dir="${ZITI_DOC_GIT_LOC}/${2}"
  if [[ -n ${3:-} ]]; then
    local BRANCH="${3}"
  else
    local BRANCH="main"
  fi
  if [ -d "${dir}" ]; then
    pushd "${dir}" >/dev/null
    git checkout "${BRANCH}"
    git pull --ff-only
    popd >/dev/null
  else
    git clone "${remote}" --branch "${BRANCH}" --single-branch "${dir}" --depth 1
  fi
}

fix_helm_ziti_edge_tunnel() {
  local _target="${ZITI_DOC_GIT_LOC}/helm-charts/charts/ziti-edge-tunnel/README.md"
  echo "fixing $_target to work with docusaurus"
  sed -i 's|<https://openziti.io>|\&lt;https://openziti.io>|g' "$_target"
  sed -i 's|<https://github.com/openziti/ziti-tunnel-sdk-c>|\&lt;https://github.com/openziti/ziti-tunnel-sdk-c>|g' "$_target"
  sed -i 's#sresponse\\\\s<|>\$#sresponse\\\\s\&lt;|>\$#g' "$_target"
}

fix_helm_ziti_controller() {
  local _target="${ZITI_DOC_GIT_LOC}/helm-charts/charts/ziti-controller/README.md"
  echo "fixing $_target to work with docusaurus"
  sed -i 's/{release}/\&lbrace;release}/g' "$_target"
  sed -i 's/{namespace}/\&lbrace;namespace}/g' "$_target"
  sed -i 's/{port}/\&lbrace;port}/g' "$_target"
}

fix_helm_ziti_router() {
  local _target="${ZITI_DOC_GIT_LOC}/helm-charts/charts/ziti-router/README.md"
  echo "fixing $_target to work with docusaurus"
  sed -i 's/{{ release }}/\&lbrace;\&lbrace; release }}/g' "$_target"
}

set -e

script_root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "$script_root"

: ${SKIP_GIT:=no}
: ${SKIP_LINKED_DOC:=no}
: ${SKIP_CLEAN:=no}
ZITI_DOC_GIT_LOC="${script_root}/docusaurus/_remotes"
SDK_ROOT_TARGET="${script_root}/docusaurus/static/docs/reference/developer/sdk"
: ${ZITI_DOCUSAURUS:=yes}
: ${SKIP_DOCUSAURUS_GEN:=no}

echo "- processing opts"

while getopts ":glcsd" OPT; do
  case ${OPT} in
    g ) # skip git
      echo "- skipping creating and updating Git working copies"
      SKIP_GIT="yes"
      ;;
    l ) # skip linked doc gen
      echo "- skipping linked doc generation"
      SKIP_LINKED_DOC="yes"
      ;;
    c ) # skip clean steps
      echo "- skipping clean step that deletes Git working copies"
      SKIP_CLEAN="yes"
      ;;
    s ) # INCLUDE stargazer stuff
      echo "- fetching stargazer data as well"
      ADD_STARGAZER_DATA="yes"
      ;;
    d ) # skip docusaurus gen
      echo "- skipping docusaurus generation"
      SKIP_DOCUSAURUS_GEN="yes"
      ;;
    *)
      echo "WARN: ignoring option ${OPT}" >&2
      ;;
  esac
done

echo "- done processing opts"

if [[ "${SKIP_GIT}" == no ]]; then
  echo "updating dependencies by rm/checkout"
  mkdir -p "${ZITI_DOC_GIT_LOC}"
  if [[ "${SKIP_CLEAN}" == no ]]; then
    rm -rf ${ZITI_DOC_GIT_LOC}/ziti-*
  fi
  git config --global --add safe.directory $(pwd)
  clone_or_pull "https://github.com/openziti/ziti" "ziti-cmd" >/dev/null
  clone_or_pull "https://github.com/openziti/ziti-sdk-csharp" "ziti-sdk-csharp" >/dev/null
  clone_or_pull "https://github.com/openziti/ziti-sdk-c" "ziti-sdk-c" >/dev/null
  clone_or_pull "https://github.com/openziti/ziti-android-app" "ziti-android-app" >/dev/null
  clone_or_pull "https://github.com/openziti/ziti-sdk-swift" "ziti-sdk-swift" >/dev/null
  clone_or_pull "https://github.com/openziti/ziti-tunnel-sdk-c" "ziti-tunnel-sdk-c" >/dev/null
  clone_or_pull "https://github.com/openziti/helm-charts" "helm-charts" >/dev/null
  clone_or_pull "https://github.com/openziti-test-kitchen/kubeztl" "kubeztl" >/dev/null
  clone_or_pull "https://github.com/openziti/desktop-edge-win" "desktop-edge-win" >/dev/null

  fix_helm_ziti_edge_tunnel
  fix_helm_ziti_controller
  fix_helm_ziti_router
fi

if [[ "${SKIP_CLEAN}" == no ]]; then
  if test -d "${SDK_ROOT_TARGET}"; then
    # specifically using ../ziti-doc just to remove any chance to rm something unintended
    echo removing previous build at: rm -r "${SDK_ROOT_TARGET}"
    rm -r "${SDK_ROOT_TARGET}" || true
  fi
fi

if [[ "${SKIP_LINKED_DOC}" == no ]]; then

  commands_to_test=(doxygen wget)

  # verify all the commands required in the automation exist before trying to run the full suite
  for cmd in "${commands_to_test[@]}"; do
    # checking all commands are on the path before continuing...
    result="$(type ${cmd} &>/dev/null && echo "Found" || echo "Not Found")"

    if [[ "Not Found" == "${result}" ]]; then
        missing_requirements+=" * ${cmd}\n"
    fi
  done

  # are requirements ? if yes, stop here and help 'em out
  if [[ -n "${missing_requirements:-}" ]]; then
      echo " "
      echo "The commands listed below are required to be on the path for this script to function properly."
      echo "Please ensure the commands listed are on the path and then try again."
      printf "\n${missing_requirements}"
      echo " "
      echo "If any of these commands are declared as aliases ensure your alias is"
      echo "declared inside of ~/.bash_aliases - or modify this script to add the aliases you require"
      exit 1
  fi

  if [[ "${ZITI_DOCUSAURUS}" == yes ]]; then
    echo "=================================================="
    #echo "csharp: building the c# sdk docs"
  #
    CSHARP_SOURCE="${ZITI_DOC_GIT_LOC}/ziti-sdk-csharp/docs"
    CSHARP_TARGET="${SDK_ROOT_TARGET}/csharp"
    echo "Copying csharp SDK docs"
    echo "    from: ${CSHARP_SOURCE}"
    echo "      to: ${CSHARP_TARGET}"
    echo " "
    mkdir -p "${CSHARP_TARGET}"
    cp -r "${CSHARP_SOURCE}/"* "${CSHARP_TARGET}"
  fi

  if test -f "${ZITI_DOC_GIT_LOC}/ziti-sdk-c/Doxyfile"; then
      pushd "${ZITI_DOC_GIT_LOC}/ziti-sdk-c" >/dev/null
      doxygen
      CLANG_SOURCE="${ZITI_DOC_GIT_LOC}/ziti-sdk-c/api"
      CLANG_TARGET="${SDK_ROOT_TARGET}/clang"
      echo " "
      echo "Copying C SDK doc"
      echo "    from: ${CLANG_SOURCE}"
      echo "      to: ${CLANG_TARGET}"
    echo " "
      mkdir -p "${CLANG_TARGET}"
      cp -r "${CLANG_SOURCE}/"* "${CLANG_TARGET}"

      echo " "
      echo "Removing"
      echo "    ${ZITI_DOC_GIT_LOC}/ziti-sdk-c/api"
      rm -rf "${ZITI_DOC_GIT_LOC}/ziti-sdk-c/api"
      popd >/dev/null
  else
      echo "ERROR: CSDK Doxyfile not located"
  fi

  if test -f "${ZITI_DOC_GIT_LOC}/ziti-sdk-swift/CZiti.xcodeproj/project.pbxproj"; then
      SWIFT_API_TARGET="${SDK_ROOT_TARGET}/swift"
      mkdir -p "${SWIFT_API_TARGET}"
      pushd "${SWIFT_API_TARGET}" >/dev/null
      swift_tgz="https://github.com/openziti/ziti-sdk-swift/releases/latest/download/ziti-sdk-swift-docs.tgz"
      echo " "
      echo "Copying Swift docs"
      echo "    from: ${swift_tgz}"
      echo "      to: ${SWIFT_API_TARGET}"
      echo " "
      echo "     via: wget -q -O - ${swift_tgz} | tar -zxv"
      pwd
      #wget -q -O - "${swift_tgz}" | tar -zxvC "${SWIFT_API_TARGET}"
      wget -q -O - "${swift_tgz}" | tar -zxv
      find "${SWIFT_API_TARGET}" -name "EnrollmentResponse*"
      popd >/dev/null
  fi
fi

if [[ "${ADD_STARGAZER_DATA-}" == "yes" ]]; then
  echo "collecting stargazer data before building the site... "
  echo "  - this requires the npm module cvstojson"
  echo "  - this requires you to have a GITHUB_TOKEN environment variable exported"
  ./gh-stats.sh
fi

if [[ "${SKIP_DOCUSAURUS_GEN}" == no ]]; then
    pushd ${ZITI_DOC_GIT_LOC}/.. >/dev/null
    echo "running 'yarn install' in ${PWD}"
    yarn install --frozen-lockfile
    echo "running 'yarn build' in ${PWD}"
    yarn build
    popd >/dev/null

    echo " "
    if test -e "${script_root}/docusaurus/build/landing.html"; then
      echo "landing.html detected. overwriting index.html with landing.html"
      cp "${script_root}/docusaurus/build/index.html" "${script_root}/docusaurus/build/index.original.html"
      cp "${script_root}/docusaurus/build/landing.html" "${script_root}/docusaurus/build/index.html"
      sed -i -e 's|https://openziti.io/|/|g' "${script_root}/docusaurus/build/index.html"
      sed -i -e 's|link\.setAttribute("href", "https://openziti\.io/|link.setAttribute("href", "/|g' "${script_root}/docusaurus/build/index.html"

      echo "landing.html sed commands run"
      echo "landing.html overwritten to index.html. index.html is now index.original.html"
    fi
fi
echo " "
echo "------------------------"
echo "gendoc complete"