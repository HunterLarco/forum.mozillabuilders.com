<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },

    entities: {
      type: Object,
      required: true,
    },
  },

  render(createElement) {
    return createElement(
      'div',
      this.parcels_.map((parcel) => {
        switch (parcel.type) {
          case 'url':
            return createElement(
              'a',
              {
                attrs: {
                  href: parcel.url,
                  target: 'blank',
                  class: this.$style.Url,
                },
              },
              parcel.value
            );
          case 'text':
            return parcel.value;
        }
      })
    );
  },

  computed: {
    parcels_() {
      if (!this.text) {
        return [];
      } else if (!this.entities) {
        return [{ type: 'text', value: this.text }];
      }

      // By default, JS string length computes the number of bytes, meaning that
      // multi-byte characters such as emojis break iteration by index. Luckily,
      // `Array.from` correctly breaks apart the characters of a string.
      const chars = Array.from(this.text);
      const parcels = [];

      // Note that this logic assumes non-overlapping entities.
      let i = 0;
      while (i < chars.length) {
        const char = chars[i];
        let charWasUsed = false;

        for (const { redirectUrl, displayUrl, range } of this.entities.urls) {
          if (i == range.start) {
            parcels.push({ type: 'url', url: redirectUrl, value: displayUrl });
            parcels.push({ type: 'text', value: '' });
            i += range.end - range.start;
            charWasUsed = true;
            break;
          }
        }

        for (const { email, range } of this.entities.emails) {
          if (i == range.start) {
            parcels.push({ type: 'url', url: `mailto:${email}`, value: email });
            parcels.push({ type: 'text', value: '' });
            i += range.end - range.start;
            charWasUsed = true;
            break;
          }
        }

        if (charWasUsed) {
          continue;
        }

        if (!parcels.length) {
          parcels.push({ type: 'text', value: '' });
        }

        parcels[parcels.length - 1].value += char;
        ++i;
      }

      return parcels;
    },
  },
};
</script>

<style module lang="sass">
.Url {
  color: inherit;
}
</style>
