/*import Firebase from 'firebase'
import 'firebase/firestore'*/

const config = {
  apiKey: "AIzaSyDwwFG_FFqxUThtEAwqW0POmBcm737mjCo",
  authDomain: "todos-4261c.firebaseapp.com",
  projectId: "todos-4261c",
  storageBucket: "todos-4261c.appspot.com",
  messagingSenderId: "443713691500",
  appId: "1:443713691500:web:78dc1af263f9b8942a9d49",
  measurementId: "G-99RC8MEEEW",
};

firebase.initializeApp(config);
firebase.analytics();
const db = firebase.firestore();

// ★STEP2
// https://jp.vuejs.org/v2/examples/todomvc.html
var todoStorage = {
  fetch: function () {
    var todos = [];
    db.collection("todos")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          console.log(doc.id, " => ", JSON.stringify(doc.data()));
          todos.push(doc.data());
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    return todos;
  },
  //追加した時の処理
  add: function (newTodo) {
    // db.collection("todos").add(newTodo)
    // console.log("add")
    db.collection("todos")
      .doc(newTodo.id)
      .set(newTodo)
      .then(() => {
        console.log("Document successfully added!");
      });
  },
  change: function (item) {
    db.collection("todos")
      .doc(item.id)
      .update({ state: item.state })
      .then(() => {
        console.log("Document successfully updated!");
      });
  },
  remove: function (item) {
    db.collection("todos").doc(item.id).delete().then(() => {
        console.log("Document successfully deleted!");
      });
  },
};

// ★STEP1
new Vue({
  el: "#app",

  data: {
    // ★STEP5 local storage から 取得した ToDo のリスト
    todos: [],
    // ★STEP5 firestore から 取得した ToDo のリスト
    // : [],
    // ★STEP11 抽出しているToDoの状態
    current: -1,
    // ★STEP11＆STEP13 各状態のラベル
    options: [
      {
        value: -1,
        label: "すべて",
      },
      {
        value: 0,
        label: "作業中",
      },
      {
        value: 1,
        label: "完了",
      },
    ],
  },

  computed: {
    // ★STEP12
    computedTodos: function () {
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state;
      }, this);
    },

    // ★STEP13 作業中・完了のラベルを表示する
    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, {
          [b.value]: b.label,
        });
      }, {});
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '作業中', 1: '完了', -1: 'すべて'}
    },
  },
  // ★STEP9
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = todoStorage.fetch();
  },
  methods: {
    // ★STEP7 ToDo 追加の処理
    doAdd: function (event, value) {
      // ref で名前を付けておいた要素を参照
      var comment = this.$refs.comment;
      // 入力がなければ何もしないで return
      if (!comment.value.length) {
        return;
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      let newId = db.collection("todos").doc().id;
      let newTodo = {
        id: newId,
        comment: comment.value,
        state: 0,
      };
      this.todos.push(newTodo);
      todoStorage.add(newTodo);
      // フォーム要素を空にする
      comment.value = "";
    },

    // ★STEP10 状態変更の処理
    doChangeState: function (item) {
      item.state = !item.state ? 1 : 0;
      todoStorage.change(item);
    },

    // ★STEP10 削除の処理
    doRemove: function (item) {
      let index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
      removeTodo = {
        id: item.id,
      };
      todoStorage.remove(item);
    },
  },
});
