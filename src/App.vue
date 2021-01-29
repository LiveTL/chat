<template>
  <div class="content" ref="content" @scroll="isAtBottom = checkIfBottom()">
    <v-main style="height: 100%">
      <div
        style="
          vertical-align: bottom;
          height: 100vh;
          width: 100vw;
          display: table-cell;
        "
      >
        <div class="message text-left highlighted">
          <strong> Welcome to HyperChat by LiveTL! </strong>
          <br/>
          HyperChat can lower CPU usage by up to 80%.
        </div>
        <v-container fluid class="lowpadding">
          <div
            v-for="message of getMessages()"
            :key="message.index"
            :id="`message${message.index}`"
            :class="{
              message: true,
              'text-left': true,
              superchat: message.info.superchat != null,
            }"
            v-show="message.shown"
            :style="{
              backgroundColor: message.info.superchat
                ? `var(--${message.info.superchat.color}) !important`
                : null,
            }"
          >
            <strong
              style="margin-right: 5px; text-decoration: underline"
              v-if="message.info.superchat"
            >{{ message.info.superchat.amount }}</strong
            >
            <strong
              style="margin-right: 5px"
              :class="
                (message.info.author.types || []).map((d) => d.split(' ')[0])
              "
            >
              {{ message.info.author.name }}
            </strong>
            <span
              v-for="(run, key, index) in message.info.message"
              :key="index"
            >
              <span v-if="run.type == 'text'">{{ run.text }}</span>
              <img
                v-else-if="run.type == 'emote' && run.src"
                :src="run.src"
                class="chatEmote"
              />
            </span>
          </div>
        </v-container>
      </div>
    </v-main>
    <v-fade-transition>
      <v-btn
        elevation="3"
        fixed
        bottom
        style="left: 50%; transform: translateX(-50%)"
        color="#0287C3"
        fab
        @click="scrollToBottom"
        v-show="!isAtBottom"
      >
        <v-icon>mdi-arrow-down</v-icon>
      </v-btn>
    </v-fade-transition>
  </div>
</template>

<script>
class Queue {
  constructor() {
    this.clear();
  }

  clear() {
    this.top = null;
    this.last = this.top;
  }

  pop() {
    const front = this.top;
    this.top = this.top.next;
    if (front === this.last) {
      this.last = null;
    }
    return front;
  }

  push(item) {
    const newItem = { data: item };
    if (this.last === null) {
      this.top = newItem;
      this.last = this.top;
    } else {
      this.last.next = newItem;
      this.last = newItem;
    }
  }
}

const CHAT_HISTORY_SIZE = 250;

export default {
  name: 'ChatUI',
  data: () => {
    return {
      messages: new Array(CHAT_HISTORY_SIZE),
      current: 0,
      queued: new Queue(),
      isAtBottom: true,
      progress: {
        current: null,
        previous: null
      },
      console
    };
  },
  metaInfo: {
    title: 'YTC (Optimized)',
    titleTemplate: '%s | LiveTL'
  },
  created() {
    window.addEventListener('resize', async () => {
      // await this.$nextTick();
      // await this.$forceUpdate();
      this.scrollToBottom();
    });
    window.addEventListener('message', async d => {
      d = JSON.parse(JSON.stringify(d.data));
      this.isAtBottom = this.checkIfBottom();
      if (d['yt-player-video-progress']) {
        this.progress.current = d['yt-player-video-progress'];
        if (
          Math.abs(this.progress.previous - this.progress.current) > 1 ||
          this.progress.current == null
        ) {
          // scrubbed or skipped
          while (this.queued.top) {
            this.newMessage(this.queued.pop().data.message);
          }
          this.isAtBottom = true;
        } else {
          while (this.queued.top != null && this.queued.top.data.timestamp <= this.progress.current) {
            const item = this.queued.pop();
            if (this.isAtBottom) {
              this.newMessage(item.data.message);
            }
          }
        }
        if (this.isAtBottom) {
          await this.$nextTick();
          this.scrollToBottom();
          // await this.$forceUpdate();
        }
        this.progress.previous = this.progress.current;
      } else if (d['yt-live-chat-set-dark-theme'] != null) {
        this.$vuetify.theme.dark = d['yt-live-chat-set-dark-theme'];
        localStorage.setItem('dark_theme', this.$vuetify.theme.dark.toString());
      } else if (d.type === 'messageChunk') {
        d.messages.forEach(async message => {
          if (!d.isReplay) {
            setTimeout(async () => {
              this.isAtBottom = this.checkIfBottom();
              if (this.isAtBottom) {
                this.newMessage(message);
                await this.$nextTick();
                this.scrollToBottom();
                // await this.$forceUpdate();
              }
            }, message.showtime);
          } else {
            this.queued.push({
              timestamp: message.showtime,
              message: message
            });
          }
        });
      }
    });
    window.parent.postMessage({
      type: 'getTheme'
    }, '*');
  },
  methods: {
    newMessage(message) {
      this.$set(this.messages, this.current, message);
      this.current++;
      this.current %= this.messages.length;
    },
    checkIfBottom() {
      const el = this.$el;
      if (!el) return true;
      return Math.ceil(el.clientHeight + el.scrollTop) >= el.scrollHeight;
    },
    scrollToBottom() {
      this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
    },
    getMessages: function * () {
      for (let i = 0; i < 2 * this.messages.length - 1; i++) {
        const message = this.messages[i % this.messages.length];
        yield {
          index: i,
          info: message || {
            author: {},
            message: []
          },
          shown:
            message != null &&
            i >= this.current &&
            i < this.messages.length + this.current
        };
      }
    }
  }
};
</script>

<style>
:root {
  --accent: rgba(0, 119, 255, 0.5);
  --blue: #6fa9ff;
  --lightblue: #00bdff;
  --turquoise: #1de9b7;
  --yellow: #ffc928;
  --orange: #f67c00;
  --pink: #fa3664;
  --red: #f63413;
}

.message {
  transform-origin: 0 100%;
  overflow: hidden;
  padding: 5px 5px 5px 5px;
  text-overflow: ellipsis;
  border-radius: 5px;
}

.message:nth-child(even) {
  /* background-color: #202020; */
}

.message:nth-child(odd) {
  background-color: #86868682;
}

.content {
  overflow-y: scroll;
  height: 100vh;
  scrollbar-width: thin;
  padding: 0px;
}

.content::-webkit-scrollbar {
  width: 4px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background: #888;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

html {
  overflow-y: hidden;
}

.highlighted {
  background-color: var(--accent) !important;
  margin: 10px;
  padding: 10px;
  width: initial;
}

.chatEmote {
  vertical-align: sub;
  height: 1.5em;
  margin: 0px 0.2em 0px 0.2em;
}

.moderator {
  color: #5e84f1 !important;
}

.member {
  color: #26a23f;
}

.superchat {
  margin: 15px 0px 15px 0px;
  color: black;
}

.lowpadding {
  padding: 0px 10px 0px 10px !important;
}

* {
  overflow-wrap: anywhere;
}
</style>