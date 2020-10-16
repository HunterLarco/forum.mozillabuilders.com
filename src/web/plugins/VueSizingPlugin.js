import WindowSizeStore, { Sizes } from '@/src/web/stores/WindowSize';

export default {
  install(Vue) {
    Vue.prototype.$sizing = (fallback, sizingMap) => {
      const labels = Array.from(Sizes.keys());
      const startIndex = labels.indexOf(WindowSizeStore.getters.size);

      if (startIndex == -1) {
        return fallback;
      }

      for (let i = startIndex; i < labels.length; ++i) {
        const label = labels[i];
        if (sizingMap[label] !== undefined) {
          return sizingMap[label];
        }
      }

      return fallback;
    };

    Vue.prototype.$sizing.gt = (width) => {
      return typeof width == 'number'
        ? WindowSizeStore.state.width > width
        : WindowSizeStore.state.width > Sizes.get(width);
    };

    Vue.prototype.$sizing.gte = (width) => {
      return typeof width == 'number'
        ? WindowSizeStore.state.width >= width
        : WindowSizeStore.state.width >= Sizes.get(width);
    };

    Vue.prototype.$sizing.lt = (width) => {
      return typeof width == 'number'
        ? WindowSizeStore.state.width < width
        : WindowSizeStore.state.width < Sizes.get(width);
    };

    Vue.prototype.$sizing.lte = (width) => {
      return typeof width == 'number'
        ? WindowSizeStore.state.width <= width
        : WindowSizeStore.state.width <= Sizes.get(width);
    };
  },
};
