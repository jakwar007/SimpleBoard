const blocks = {};
let currentLayout = null;

module.exports = {
    section(name, content) {
        blocks[name] = content;
        return '';
    },

    yield(name) {
        const content = blocks[name] || '';
        delete blocks[name];
        return content;
    },

    layout(name) {
        currentLayout = name;
        return '';
    },

    endSection() {
        return '';
    },

    renderLayout() {
        const layout = currentLayout;
        this.clear();
        return layout;
    },

    clear() {
        Object.keys(blocks).forEach(key => delete blocks[key]);
        currentLayout = null;
    }
};