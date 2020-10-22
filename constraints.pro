% KB - Find all package.json filepaths of public packages.
%
% (L1) A filepath `PackageFilepath` is a filepath of a public package package.json file
% (L2) if `PackageFilepath` is a filepath of a package.json file
% (L3) and the package.json file at `PackageFilepath` does NOT have field "private" set to "true".
is_public_package(PackageFilepath) :-                                              % (L1)
    workspace(PackageFilepath),                                                    % (L2)
    \+ (workspace_field(PackageFilepath, 'private', 'true')).                      % (L3)

% KB - Find yarn-workspace package.json filepath.
%
% (L1) A filepath `PackageFilepath` is a filepath of yarn-workspace package.json file
% (L2) if `PackageFilepath` is a filepath of a package.json file
% (L3) and the package.json file at `PackageFilepath` has field "workspaces" of javascript type array.
is_yarn_workspace_package(PackageFilepath) :-                                      % (L1)
    workspace(PackageFilepath),                                                    % (L2)
    workspace_field_test(PackageFilepath, 'workspaces', 'Array.isArray($$)').      % (L3)

% =================================================================================

% Validate - All package.json of public packages must have license "MIT".
%
% (L2) For all package.json (with filepath `PackageFilepath`) that is public,
% (L1) ->  Validate package.json at `PackageFilepath` has field "license" set to "MIT".
gen_enforced_field(PackageFilepath, 'license', '"MIT"') :-                         % (L1)
    is_public_package(PackageFilepath).                                            % (L2)

% Validate - The yarn-workspace package.json must not have any "dependencies" or "peerDependencies".
%
% (L4) For all package.json (with filepath `PackageFilepath`),
% (L4) ->  For all dependencies (with name `DependencyIdent`) of any `DependencyType`,
% (L3)     ->  For all `PackageFilepath` that is the yarn-workspace package.json,
% (L2)         ->  For all `DependencyType` that is not "devDependencies",
% (L1)             ->  Validate package.json at `PackageFilepath` does NOT have dependency with name `DependencyIdent` as `DependencyType`.
gen_enforced_dependency(PackageFilepath, DependencyIdent, null, DependencyType) :- % (L1)
    DependencyType \= 'devDependencies',                                           % (L2)
    is_yarn_workspace_package(PackageFilepath),                                    % (L3)
    workspace_has_dependency(PackageFilepath, DependencyIdent, _, DependencyType). % (L4)

% Validate - Dependency "husky" must be version "3.1.0", regardless of being inside "dependencies", "devDependencies", "peerDependencies".
%
% (L2) For all package.json (with filepath `PackageFilepath`) that depends on "husky" as any `DependencyType`,
% (L1) ->  Validate package.json at `PackageFilepath` depends on "husky" version "3.1.0" as `DependencyType`.
gen_enforced_dependency(PackageFilepath, 'husky', '3.1.0', DependencyType) :-      % (L1)
    workspace_has_dependency(PackageFilepath, 'husky', _, DependencyType).         % (L2)
