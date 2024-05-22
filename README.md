-- The simplest way to use React with Django

In the simplest way possible, we'll setup a React frontend (using Typescript) with a Django backend, using good practices as we go.

## Q. Why would I use React? Couldn't I just use Django templates with HTMX?</summary>
A. In many cases, the most efficient route is to use Django templates with HTMX [(Example guide here)], or Alpine js [Example guide here]. 

To give you some concrete examples:
- I could have built v2 of [Photon Designer] with Django and HTMX
- I should have built [Amazing.photos] with Django HTMX.
- I built RedstoneHR (which I later sold) largely with Django and HTMX 
- A close friend's company is growing quickly, has over $1M ARR, and is profitable with a powerful product built using Django and HTMX. 
He also needs fewer developers because they are each so productive with Django and HTMX.

In short, it is generally much faster to build with Django and HTMX because there is less complexity. 
With Django and HTMX/Alpine, you just need one server. And you don't need to handle communicating between a frontend and backend server.

But, using Django + HTMX isn't always the best fit. If you're building something like Webflow or Figma - where you have a lot of client state - I'd recommend using a frontend framework.
If you're not sure, start with Django + HTMX.

***

Anyway, let's start building!


## 1. Setup React
We'll use Vite to setup our React frontend. Vite is a build tool provide a fast development experience for React (and other frontend frameworks).

<details>
<summary>Q. Why do I need Vite?</summary>
A. Without Vite, you'll need to setup a lot of things manually. Vite provides a lot of things out of the box, like hot module replacement, fast builds, and more. There's negligible value to doing this yourself. 
So, I'd recommend using Vite
</details>

### Install node and npm
Check if you have node and npm installed by running the following commands:
```bash
node -v
npm -v
```
If you see the version numbers, you're good to go.
If you don't, install them from [here](https://nodejs.org/en/download/).


<details>
<summary>Q. What are node and npm?</summary>
A. Node.js allows you to run javascript on your computer, and outside the browser. 
A. npm is a package manager for node.js, which allows you to install and manage packages.
</details>

### Install Vite
```bash
npm create vite@latest
```
And then enter the following options:
- Project name: react+django
- Package name: frontend
- Framework: React
- Variant: TypeScript

You should see a message saying "Done"

## Run your React app in development
- Following Vite's instructions, run:
```bash
cd react+django
npm install
npm run dev
```

You should see something like this:
```
VITE v___  ready in 449 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

- Visit `http://localhost:5173/` in your browser. You should see your React app!

## Style your React app to test the hot reloader (that Vite provides)

To add some custom styles, I'll use [Photon Designer](https://app.photondesigner.com?ref=use-react){:target="_blank"} to design a simple gallery to display apples, perhaps I'm a fruit seller.
Here's a video using [Photon Designer](https://app.photondesigner.com?ref=use-react){:target="_blank"} to create this UI in 2 minutes: [Video link]


### 1. Generate UI with Photon Designer or paste my code
Either:
a. use [Photon Designer](https://app.photondesigner.com?ref=use-react){:target="_blank"} for free to create your own UI, or 
b. copy the below code into `react+django/src/App.tsx`:
```tsx
import './App.css'

function App() {
    const apples = [
        {name: 'Bramley', color: 'red and green', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bramley%27s_Seedling_Apples.jpg/320px-Bramley%27s_Seedling_Apples.jpg'},
        {name: 'Cox Orange Renette', color: 'yellow', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Cox_orange_renette2.JPG/320px-Cox_orange_renette2.JPG'},
        {name: 'Granny Smith', color: 'green', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Granny_smith_closeup.jpg/320px-Granny_smith_closeup.jpg'},
        {name: 'SugarBee', color: 'red and yellow', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/The_SugarBee_Apple_now_grown_in_Washington_State.jpg/320px-The_SugarBee_Apple_now_grown_in_Washington_State.jpg'},
    ]

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {apples.map((apple, index) => (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden" key={index}>
                        <img
                            src={apple.photoUrl}
                            alt={`A beautiful round apple, with a shiny skin, perfect for eating or baking. The ${apple.name} apple has a ${apple.color} color.`}
                            className="w-full h-48 object-cover"
                            width="400"
                            height="300"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{apple.name}</h3>
                            <p className="text-gray-600">Color: {apple.color}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default App
```

### 2. Add Tailwind CSS to your React app
- Paste the below into `react+django/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Great - you've now setup a React frontend with Vite and Tailwind CSS!
Let's now send data from Django to React.

## 2. Setup Django
We'll set up a simple Django backend to send data to our React frontend.


### Create a new Django project
```bash
pip install --upgrade django django-cors-headers
django-admin startproject core .
python manage.py startapp apples
```

### Update our settings in `core/settings.py`
#### Register installed apps
- Add `apples` and 'corsheaders' (necessary to prevent Django from blocking our React frontend to the `INSTALLED_APPS` list in `core/settings.py`
```python
INSTALLED_APPS = [
    ...
    "corsheaders",
    "apples",
]
```
#### Add CORS settings
- Add the following to the bottom of `core/settings.py`
```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]  # Make sure the port number matches the one you're using for the React app.
```

#### Add middleware
- Add the following to the `MIDDLEWARE` list in `core/settings.py`
```python
MIDDLEWARE = [
    ...
    "corsheaders.middleware.CorsMiddleware",
    ...
]
```


### Create a model for the apples in `apples/models.py`
```python
from django.db import models


class Apple(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    photo_url = models.URLField()

    def __str__(self):
        return self.name
```

### Create and apply migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Add some apples to the database using the Django ORM
- Open your Django shell via the terminal
```bash
python manage.py shell
```

- Add some apples to your database (using the Django ORM)
```python
from apples.models import Apple

Apple.objects.create(name='Bramley', color='red and green', photo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bramley%27s_Seedling_Apples.jpg/320px-Bramley%27s_Seedling_Apples.jpg')
Apple.objects.create(name='Cox Orange Renette', color='yellow', photo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Cox_orange_renette2.JPG/320px-Cox_orange_renette2.JPG')
Apple.objects.create(name='Granny Smith', color='green', photo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Granny_smith_closeup.jpg/320px-Granny_smith_closeup.jpg')
Apple.objects.create(name='SugarBee', color='red and yellow', photo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/The_SugarBee_Apple_now_grown_in_Washington_State.jpg/320px-The_SugarBee_Apple_now_grown_in_Washington_State.jpg')
```


### Create a serializer for the apples 
- Create a file in your Django app called `serializers.py` (i.e., `apples/serializers.py`) containing:
```python
from .models import Apple
from typing import Iterable, List, Dict, Any


def serialize_apples(apples: Iterable[Apple]) -> List[Dict[str, Any]]:
    data = []
    for apple in apples:
        data.append({
            'name': apple.name,
            'color': apple.color,
            'photo_url': apple.photo_url,
        })
    return data
```

### Create a view to return the apples as JSON in `apples/views.py`
```python
from .models import Apple
from .serializers import serialize_apples
from django.http import JsonResponse


def apple_list(request):
    apples = Apple.objects.all()
    return JsonResponse(serialize_apples(apples), safe=False)
```

### Add your urls
- Paste this into `core/urls.py`:
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('apples/', include('apples.urls')),
]
```

- Create a file called `urls.py` in your Django app (i.e., `apples/urls.py`), and paste in the below:
```python
from django.urls import path
from . import views


urlpatterns = [
    path('', views.apple_list),
]
```

### Check your Django API
- Run your Django server
```bash
python manage.py runserver
```
- Visit `http://localhost:8000/apples` in your browser (Don't forget the /apples slug). You should see the apples you added to the database in JSON format.

You should see something like this:
![JSON data of apple returned from Django REST API]()

Great - you've now setup a Django backend with a simple API to send data to your React frontend.


## 3. Connect React and Django
We have a Django backend and a React frontend. Let's connect them.

### Install Axios in the React app
- Make sure you're in the `react+django` directory
```bash
cd react+django
```
- Install axios (a popular library for making HTTP requests) in your React app
```bash
npm install axios
```

### Fetch the apples from Django in your React app
- Paste the below into `react+django/src/App.tsx`
```tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
    const [apples, setApples] = useState<Apple[]>([])

    interface Apple {
        name: string;
        color: string;
        photo_url: string;
    }

    useEffect(() => {
        const applesListUrl = 'http://localhost:8000/apples/'
        axios.get<Apple[]>(applesListUrl)
            .then(response => setApples(response.data))
    }, [])

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {apples.map((apple, index) => (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden" key={index}>
                        <img
                            src={apple.photo_url}
                            alt={`${apple.name} apple`}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{apple.name}</h3>
                            <p className="text-gray-600">Color: {apple.color}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default App
```

### See your React app fetch data from Django
- Run your Django server
```bash
python manage.py runserver
```
- In a separate terminal window, run your React server
```bash
npm run dev
```
- Visit your React app at `http://localhost:5173/`. 



## Congrats - You've set up a React frontend with Django! ✅
And that's it! You now have a working React frontend with a Django backend. The React app fetches data from the Django API and displays it.


### Some ideas for next steps - Deployment or Auth?
- Add authentication to the Django API and React frontend
- Add create, update, delete functionality to the Django API and connect it to the React frontend
- Deploy the Django backend and React frontend to production

I'd be happy to do a part 2 showing you:
i. how to deploy both to production (it's very quick to do (10 mins) once you know how). 
ii. how to add simple authentication to the Django API and React frontend (also very quick to do (10 mins) once you know how).

Email me / Comment on Youtube if you'd like either 🙂

## Final repo for reference
Here's all the code in [a repo](













