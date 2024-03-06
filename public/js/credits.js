
const unused = [
    {
        title: 'Github Pages',
        subtitle: 'Github Pages',
        description: 'GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website. You can see examples of GitHub Pages sites in the GitHub Pages examples collection.',
        img: 'img/credits/github-logo.svg',
        link: 'https://pages.github.com/'
    }
]



const items = [
    {
        title: 'HTML',
        subtitle: 'HyperText Markup Language',
        description: 'The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript.',
        img: 'img/credits/html5-logo.svg',
        link: 'https://www.w3.org/html/'
    },
    {
        title: 'CSS',
        subtitle: 'Cascading Style Sheets',
        description: 'Google Domains is a domain name registrar operated by Google. The service offers domain registration, DNS hosting, dynamic DNS, domain forwarding, and email forwarding. It provides native integration support for Google Cloud DNS and Google Workspace',
        img: 'img/credits/css3-logo.svg',
        link: 'https://www.w3.org/Style/CSS/Overview.en.html'
    },
    {
        title: 'JavaScript',
        subtitle: 'JavaScript',
        description: 'JavaScript is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.',
        img: 'img/credits/javascript-logo.png',
        link: 'https://www.javascript.com/'
    },
    {
        title: 'Node.js',
        subtitle: 'Node.js',
        description: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.',
        img: 'img/credits/nodejs-logo.png',
    }

]

const container = document.getElementById('container')

items.forEach(item => {
    console.log("hej")

    const card = document.createElement('section')
    card.classList.add('card')

    const imageDiv = document.createElement('div')
    imageDiv.classList.add('imageDiv')
    card.appendChild(imageDiv)

        const img = document.createElement('img')
        img.src = item.img;
        img.alt = item.title;
        imageDiv.appendChild(img)
    

    const textDiv = document.createElement('div')
    textDiv.classList.add('textDiv')

        const title = document.createElement('h2')
        title.textContent = item.title
        textDiv.appendChild(title)


        const subtitle = document.createElement('h3')
        subtitle.textContent = item.subtitle
        textDiv.appendChild(subtitle)


        const description = document.createElement('p')
        description.textContent = item.description
        textDiv.appendChild(description)


        const link = document.createElement('a')
        link.href = item.link
        link.textContent = 'More info'
        textDiv.appendChild(link)
    
    card.appendChild(textDiv)

    container.appendChild(card)
})