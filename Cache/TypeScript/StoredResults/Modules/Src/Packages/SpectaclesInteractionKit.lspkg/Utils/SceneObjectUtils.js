"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS = void 0;
exports.findSceneObjectByName = findSceneObjectByName;
exports.isDescendantOf = isDescendantOf;
exports.findComponentInChildren = findComponentInChildren;
exports.findAllComponentsInChildren = findAllComponentsInChildren;
exports.findComponentInSelfOrChildren = findComponentInSelfOrChildren;
exports.findAllComponentsInSelfOrChildren = findAllComponentsInSelfOrChildren;
exports.findComponentInParents = findComponentInParents;
exports.findAllComponentsInParents = findAllComponentsInParents;
exports.findComponentInSelfOrParents = findComponentInSelfOrParents;
exports.findAllComponentsInSelfOrParents = findAllComponentsInSelfOrParents;
exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS = 16;
exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS = 16;
function searchComponentInChildren(currentObject, currentDepth, maxDepth, componentType) {
    if (currentDepth >= maxDepth) {
        return null;
    }
    const childrenCount = currentObject.getChildrenCount();
    for (let i = 0; i < childrenCount; i++) {
        const child = currentObject.getChild(i);
        const component = child.getComponent(componentType);
        if (component) {
            return component;
        }
        const foundInChildren = searchComponentInChildren(child, currentDepth + 1, maxDepth, componentType);
        if (foundInChildren) {
            return foundInChildren;
        }
    }
    return null;
}
function searchAllComponentsInChildren(currentObject, currentDepth, maxDepth, componentType, results) {
    if (currentDepth >= maxDepth) {
        return;
    }
    const childrenCount = currentObject.getChildrenCount();
    for (let i = 0; i < childrenCount; i++) {
        const child = currentObject.getChild(i);
        const matchingComponents = child.getComponents(componentType);
        for (let j = 0; j < matchingComponents.length; j++) {
            results.push(matchingComponents[j]);
        }
        searchAllComponentsInChildren(child, currentDepth + 1, maxDepth, componentType, results);
    }
}
/**
 * Searches for a SceneObject with the given name in the tree rooted at the given root SceneObject.
 *
 * @param root - The root SceneObject of the tree to search.
 * @param name - The name of the SceneObject to search for.
 * @returns The first SceneObject with the given name if it exists in the tree, or undefined otherwise.
 */
function findSceneObjectByName(root, name) {
    if (root === null) {
        const rootObjectCount = global.scene.getRootObjectsCount();
        let current = 0;
        while (current < rootObjectCount) {
            const result = findSceneObjectByName(global.scene.getRootObject(current), name);
            if (result) {
                return result;
            }
            current += 1;
        }
    }
    else {
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.getChildrenCount(); i++) {
            const child = root.getChild(i);
            const result = findSceneObjectByName(child, name);
            if (result) {
                return result;
            }
        }
    }
    return null;
}
/**
 * Checks if a {@link SceneObject} is a descendant of another.
 * @param sceneObject - the potential descendant.
 * @param root - the potential ascendant.
 * @returns true, if sceneObject is a descendant of root,
 * otherwise, returns false.
 */
function isDescendantOf(sceneObject, root) {
    if (sceneObject === root) {
        return true;
    }
    const parent = sceneObject.getParent();
    if (parent === null) {
        return false;
    }
    return isDescendantOf(parent, root);
}
function findComponentInChildren(sceneObject, componentType, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    return searchComponentInChildren(sceneObject, 0, maxDepth, componentType);
}
function findAllComponentsInChildren(sceneObject, componentType, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    const results = [];
    searchAllComponentsInChildren(sceneObject, 0, maxDepth, componentType, results);
    return results;
}
function findComponentInSelfOrChildren(sceneObject, componentType, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    const selfComponent = sceneObject.getComponent(componentType);
    if (selfComponent) {
        return selfComponent;
    }
    return findComponentInChildren(sceneObject, componentType, maxDepth);
}
function findAllComponentsInSelfOrChildren(sceneObject, componentType, maxDepth = exports.DEFAULT_MAX_CHILD_SEARCH_LEVELS) {
    const results = sceneObject.getComponents(componentType);
    searchAllComponentsInChildren(sceneObject, 0, maxDepth, componentType, results);
    return results;
}
function findComponentInParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent && levelsSearched < maxLevels) {
        const component = parent.getComponent(componentType);
        if (component) {
            return component;
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return null;
}
function findAllComponentsInParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const results = [];
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent && levelsSearched < maxLevels) {
        const matchingComponents = parent.getComponents(componentType);
        for (let j = 0; j < matchingComponents.length; j++) {
            results.push(matchingComponents[j]);
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return results;
}
function findComponentInSelfOrParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const selfComponent = sceneObject.getComponent(componentType);
    if (selfComponent) {
        return selfComponent;
    }
    return findComponentInParents(sceneObject, componentType, maxLevels);
}
function findAllComponentsInSelfOrParents(sceneObject, componentType, maxLevels = exports.DEFAULT_MAX_PARENT_SEARCH_LEVELS) {
    const results = sceneObject.getComponents(componentType);
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent && levelsSearched < maxLevels) {
        const matchingComponents = parent.getComponents(componentType);
        for (let j = 0; j < matchingComponents.length; j++) {
            results.push(matchingComponents[j]);
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return results;
}
//# sourceMappingURL=SceneObjectUtils.js.map