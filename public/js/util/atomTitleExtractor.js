export const atomTitleExtractor = (atom) => {

    if (atom.title) {
        return atom.title;
    }

    switch(atom.atomType) {
        case ("explainer"): return atom.data.explainer.title;
        case ("cta"): return atom.data.cta.label;
        case ("recipe"): return atom.data.recipe.title;
        case ("storyquestions"): return atom.data.storyquestions.title;
        case ("media"): return atom.data.media.title;
    }
};