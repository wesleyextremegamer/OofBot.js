# OofBot.js 1.1 

welp. <img width="155" height="160" alt="image" src="https://github.com/user-attachments/assets/12b61eb4-3b10-4857-9c6b-98e93d9b6f78" />

**Discord Bot made with  [Discord.js 14.26.2](https://discord.js.org/docs/packages/discord.js/14.26.2)**\
**By Wenpire.**

## Basically, What is this?
This is my first *REAL* project that I chose to share here at Github, its a simple Bot Client that I'm working on for a while.
My goal here is to improve my JS skills, create something *useful* and make it a public thing, so anyone can see my progress.
> [!NOTE]
> If you want to use my code or create something better from it, I wouldn't mind. Feel free to explore.\
> Also, the code can be broken at some point as this is not a **PROFESSIONAL** project, so new commits can come with new *bugs*, so patience 💢.


## Commands
> This section contains all the commands ready so far (separated by type).

  ### Ping
  That's the first command I created, its not thaaat amazing, but at least I tried to be creative >:(
  
  1. **_And what does that do?_**\
    - This command prints an embed content with cool bot and latency info\
    - woah...
    
  2. **_Features_**\
    - Have a refresh button.\
    - Handle latency weird bugs with placeholders.\
    - Dont know what those latency bullshit means? NO WORRIES ! `*Ping status : everything is ok*`\
    - Use emojis, after all, that's the better way to explain what is happening in the screen.\
    - Its neerdy, no one needs those information but who cares? its freaking cool ! \
    - its stylish and organized. (Better than other bots 🧐)\
     
  #### Usage
  
  <img width="619" height="171" alt="Discord bot command usage" src="https://github.com/user-attachments/assets/fe698f4f-8a3c-47c5-a565-389b5cae4994" />

  #### Result
  
  <img width="605" height="356" alt="Discord bot command result" src="https://github.com/user-attachments/assets/3a7c13c8-979a-430c-9fcc-1d21bc4fa071" />
  
  #### Comparison with other bots
  - **Lorrita**\
    <img width="620" height="142" alt="image" src="https://github.com/user-attachments/assets/87b24a81-6a1d-4ec8-bdd8-146076fff197" />
    > *5/10 - OK, but only because It has info about the Cluster*
    
  + **Dank Memer**\
    <img width="620" height="167" alt="image" src="https://github.com/user-attachments/assets/eac7e758-0b01-450d-8c5f-e8385e35951a" />
    > **2/10 - Meh, my grandma could do better than this*
  
  ### yt-Downloader 
  Im trying to show some work here, leave me alone.

  > [!WARNING]
  > This command is Experimental and is not activated normally !\
  > change the variable `EXPERIMENTAL_COMMANDS` in `src/configs/DEF.env` and it should load normally.
> 
  1. **_And what does that do?_**\
    - This command downloads videos from Youtube using yt-dlp\
    - woah
    
  3. **_Features (Or not)_**\
    - Downloads videos (Duh).\
    - You can choose the video quality.\
    - Handle errors very well (I think)\
    - Its Against the discord and youtube rules, so chill out there.\
    - Please google, dont Cease and Desist me 🥹

  #### Usage
  
  <img width="628" height="171" alt="image" src="https://github.com/user-attachments/assets/a6ca7110-30ae-4089-8944-589b8153b367" />

  #### Result

  <img width="356" height="409" alt="image" src="https://github.com/user-attachments/assets/95d791b9-c3f3-4cbd-a802-51d5bb8f72ea" />

  #### B-but how???!
  Bro, im the goat.\
  Joking, its not that hard, its just boooring, let me tell you :

  - **Structure**
  1. script.js executes codes using `spawn()`
  2. with this, executes a script in `scripts/yt-dlp.py`
  3. this ass snake python script spits a stdOut with the file filename saved in `temp/temp_downloads`
  4. the script.js makes the rest and so.
  5. AAH BORRING...

## Setup
> After all this cringe yapping, here, let me help you make this little boy run for the first time

> [!WARNING]
> You need your own Discord TOKEN !!!
>  Of course im not giving you my Token, **DEAL WITH IT 😎**
> Just create a application and your token here : [**Developers Portal**](https://discord.com/developers/home)\

> [!NOTE]
> Its not like I needed to say but, you need install [**Node.Js**](https://nodejs.org/pt-br)

**By the way first of all you need to install all the dependencies of `package.json` in the `src` folder with `npm i` or `npm install`.**

- **_Env File Configuration_**
1. **Go to `src/configs`
2. **Create a file called `KEYS.env`
3. Create a variable called `DISCORD_TOKEN` and give it your TOKEN (yes, it deserve it) : `DISCORD_TOKEN=YOUR_TOKEN`
4. Create a variable called `CLIENT_ID` and give it your bot id : `CLIENT_ID=ID`
5. Adjust variables in `src/configs/DEF.env` as you desire
6. Run `node index.js`
7. Have fun !

>[!NOTE]
>*You*: I did everything correctly and I had an Error, wenpire 😿.\
>*Me*: oh nuuu, thats horrible !\
>*Me*: Dont mind fixing it on your own :)\
>*Me*: And if it is my fault, sorry guy, wait until I fix it my self next time.



