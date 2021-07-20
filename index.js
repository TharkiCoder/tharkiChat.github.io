window.onload = function() {
    // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCet5qjx36qsOTz2NaMr7L6aE6dE4_E7qQ",
    authDomain: "tharkicoders-chat.firebaseapp.com",
    projectId: "tharkicoders-chat",
    storageBucket: "tharkicoders-chat.appspot.com",
    messagingSenderId: "215787992229",
    appId: "1:215787992229:web:cb3de633efe0aa80a0494c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.database()

  class MEME_CHAT{
    home(){
      // document.body.innerHTML=''
      // document.location.reload()
      this.create_title()
      this.create_join_form()
    }
    chat(){
      this.create_title()
      this.create_chat()
    }
    create_title(){
      var title_container = document.createElement('div')
      title_container.setAttribute('id', 'title_container')
      var title_inner_container = document.createElement('div')
      title_inner_container.setAttribute('id', 'title_inner_container')

      var title = document.createElement('h1')
      title.setAttribute('id', 'title')
      title.textContent = 'tharkiCoder Chats'

      title_inner_container.append(title)
      title_container.append(title_inner_container)
      document.body.append(title_container)
    }
    create_join_form(){
      // YOU MUST HAVE (PARENT = THIS). OR NOT. I'M NOT YOUR BOSS!😂
      var parent = this;

      var join_container = document.createElement('div')
      join_container.setAttribute('id', 'join_container')
      var join_inner_container = document.createElement('div')
      join_inner_container.setAttribute('id', 'join_inner_container')

      var join_button_container = document.createElement('div')
      join_button_container.setAttribute('id', 'join_button_container')

      var join_button = document.createElement('button')
      join_button.setAttribute('id', 'join_button')
      join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>'
      var join_input_container = document.createElement('div')
      join_input_container.setAttribute('id', 'join_input_container')

      var join_input = document.createElement('input')
      join_input.setAttribute('id', 'join_input')
      join_input.setAttribute('maxlength', 15)
      join_input.placeholder = 'No.... It\'s Patrick Star'
      join_input.onkeyup  = function(){
        if(join_input.value.length > 0){
          join_button.classList.add('enabled')
          join_button.onclick = function(){
            parent.save_name(join_input.value)
            join_container.remove()
            parent.create_chat()
          }
        }else{
          join_button.classList.remove('enabled')
        }
      }

      join_button_container.append(join_button)
      join_input_container.append(join_input)
      join_inner_container.append(join_input_container, join_button_container)
      join_container.append(join_inner_container)
      document.body.append(join_container)
    }
    create_load(id){
      // YOU ALSO MUST HAVE (PARENT = THIS). BUT IT'S WHATEVER THO.
      var parent = this;
      var container = document.getElementById(id)
      container.innerHTML = ''

      var loader_container = document.createElement('div')
      loader_container.setAttribute('class', 'loader_container')

      var loader = document.createElement('div')
      loader.setAttribute('class', 'loader')

      loader_container.append(loader)
      container.append(loader_container)

    }
    create_chat(){
      var parent = this;
      // GET THAT MEMECHAT HEADER OUTTA HERE
      var title_container = document.getElementById('title_container')
      var title = document.getElementById('title')
      title_container.classList.add('chat_title_container')
      title.classList.add('chat_title')
      var chat_container = document.createElement('div')
      chat_container.setAttribute('id', 'chat_container')

      var chat_inner_container = document.createElement('div')
      chat_inner_container.setAttribute('id', 'chat_inner_container')

      var chat_content_container = document.createElement('div')
      chat_content_container.setAttribute('id', 'chat_content_container')

      var chat_input_container = document.createElement('div')
      chat_input_container.setAttribute('id', 'chat_input_container')

      var chat_input_send = document.createElement('button')
      chat_input_send.setAttribute('id', 'chat_input_send')
      chat_input_send.setAttribute('disabled', true)
      chat_input_send.innerHTML = '<i class="far fa-paper-plane"></i>'

      var chat_input = document.createElement('input')
      chat_input.setAttribute('id', 'chat_input')
      chat_input.setAttribute('maxlength', 1000)
      chat_input.placeholder = `${localStorage.getItem('name')} Say something...`
      chat_input.onkeyup  = function(){
        if(chat_input.value.length > 0){
          chat_input_send.removeAttribute('disabled')
          chat_input_send.classList.add('enabled')
          chat_input_send.onclick = function(){
            chat_input_send.setAttribute('disabled', true)
            chat_input_send.classList.remove('enabled')
            if(chat_input.value.length <= 0){
              return
            }
            parent.create_load('chat_content_container')
            parent.send_message(chat_input.value)
            chat_input.value = ''
            // Focus on the input there after
            chat_input.focus()
          }
        }else{
          chat_input_send.classList.remove('enabled')
        }
      }

      var chat_logout_container = document.createElement('div')
      chat_logout_container.setAttribute('id', 'chat_logout_container')
     var chat_logout = document.createElement('button')
      chat_logout.setAttribute('id', 'chat_logout')
      chat_logout.textContent = `${localStorage.getItem('name')} logout`
      chat_logout.onclick = function(){
        document.body.innerHTML=''
        localStorage.clear()
        document.location.reload()
        parent.home()
      }

      chat_logout_container.append(chat_logout)
      chat_input_container.append(chat_input, chat_input_send)
      chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container)
      chat_container.append(chat_inner_container)
      document.body.append(chat_container)
      parent.create_load('chat_content_container')
      this.refresh_chat()
    }
    save_name(name){
      localStorage.setItem('name', name)
    }
    send_message(message){
      var parent = this
      if(parent.get_name() == null && message == null){
        return
      }

      var messages = db.ref('chats/');
      var date=new Date();
      messages.once('value', function(snapshot) {
        var index = parseFloat(snapshot.numChildren()) + 1
        db.ref('chats/' + `message_${index}`).set({
          name: parent.get_name()+" "+date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear(),
          message: message,
          index: index
        })
        .then(function(){
          parent.refresh_chat()
        })
      })
    }
    get_name(){
      if(localStorage.getItem('name') != null){
        return localStorage.getItem('name')
      }else{
        this.home()
      }
    }
    refresh_chat(){
      var chat_content_container = document.getElementById('chat_content_container')

      var messages = db.ref('chats/');
      messages.on('value', function(snapshot) {
        chat_content_container.innerHTML = ''
        if(snapshot.numChildren() == 0){
          return
        }
        var values = Object.values(snapshot.val());
        var guide = []
        var unordered = []
        var ordered = []
        for (var i, i = 0; i < values.length; i++) {
          guide.push(i+1)
          unordered.push([values[i], values[i].index]);
        }

        guide.forEach(function(key) {
          var found = false
          unordered = unordered.filter(function(item) {
            if(!found && item[1] == key) {
              ordered.push(item[0])
              found = true
              return false
            }else{
              return true
            }
          })
        })

        ordered.forEach(function(data) {
          var name = data.name
          var message = data.message

          var message_container = document.createElement('div')
          message_container.setAttribute('class', 'message_container')

          var message_inner_container = document.createElement('div')
          message_inner_container.setAttribute('class', 'message_inner_container')

          var message_user_container = document.createElement('div')
          message_user_container.setAttribute('class', 'message_user_container')

          var message_user = document.createElement('p')
          message_user.setAttribute('class', 'message_user')
          message_user.textContent = `${name}`

          var message_content_container = document.createElement('div')
          message_content_container.setAttribute('class', 'message_content_container')

          var message_content = document.createElement('p')
          message_content.setAttribute('class', 'message_content')
          message_content.textContent = `${message}`
          message_user_container.append(message_user)
          message_content_container.append(message_content)
          message_inner_container.append(message_user_container, message_content_container)
          message_container.append(message_inner_container)

          chat_content_container.append(message_container)
        });
        // Go to the recent message at the bottom of the container
        chat_content_container.scrollTop = chat_content_container.scrollHeight;
      })
    }
  }

  app = new MEME_CHAT()
  // if this is a new user then take them to the home screen
  if(localStorage.getItem('name') == null){
    app.home()
  }else{
    // else. They are a return user.
    app.chat()
}}
