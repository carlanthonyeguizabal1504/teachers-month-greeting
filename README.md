# Teacher's Month Greeting Website

An interactive three-page greeting with a professor portrait card, appreciation messages, confetti, sound effects, and a YouTube song player.

## Add the appreciation messages

Open `index.html` in VS Code and search for these comments:

- `MESSAGE 1`
- `MESSAGE 2`

Place the message between the opening and closing `<p class="message-text">` tags. Example:

```html
<p class="message-text">
  Thank you for inspiring us every day.
</p>
```

The messages are static. Visitors cannot edit them on the website.

## Add the professor's photo

Save the professor's picture in this folder, then replace the placeholder inside `index.html` with an image element such as:

```html
<img src="professor.jpg" alt="Portrait of our professor" />
```

## Preview locally

Open `index.html` in a browser. For the most accurate preview in VS Code, use the Live Server extension.
