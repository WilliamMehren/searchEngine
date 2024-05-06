import requests as rq,mysql.connector
from bs4 import BeautifulSoup as bs
from datetime import datetime

# Funksjon som henter ut alt inneholdet i robots.txt filen
def check_robots(url):
    parsed_url = url
    robots_url = url + "/robots.txt"

    # Sjekker om linken inneholder noen subsider og fjerner alle subsider + legger til robots.txt
    if url.count("/") > 2:
        parts = url.split('/', 3)
        if len(parts) >= 4:
            parsed_url = '/'.join(parts[:3])
            robots_url = '/'.join(parts[:3]) + "/robots.txt"

    # Sjekker om Robots.txt exisrerer
    response = rq.head(robots_url)
    if response.status_code == 200:
        print("Robots.txt found!")
        # Scraper robots.txt og sender inneholdet til en local txt fil
        req = rq.get(robots_url)
        robots_soup = bs(req.text, "html.parser")
        # print(robots_soup)

        # gjør om robots.txt til en array
        rules = []
        for line in robots_soup.text.split('\n'):
            if line.startswith('User-agent'):
                agent = line.split(': ')[-1]
                if agent == "user_agent" or agent == '*':
                    rules = []
            rules.append(line.strip())

        # Sjekker om url-en er tillat i robots.txt
        for line in rules:
            if line.startswith('Disallow'):
                disallow_path = line.split(': ')[-1]
                if disallow_path == '/':
                    return False
                elif parsed_url.path.startswith(disallow_path):
                    return True
        return False
    else:
        print("No Robots.txt!")
        return False

# Funksjon som scraper siden og filtrerer ut den viktigste informasjonen
def scrape(url:str) -> None:
    if check_robots(url) == False:
        # Ikke legge til linker i køen som allered er der
        # Ikke legge til linker i køen som har blitt scrapet nylig (Hent scrapetid fra database)
        # Oppdater så den henter riktig informasjon som excerp
        # Oppdater så den legger inn informasjonen i databasen via API-en

        req = rq.get(url)
        soup = bs(req.text, 'html.parser')

        print("Important info from scrape:")
        print("Time: ", datetime.now().strftime("%d/%m/%Y %H:%M"))
        print("URL: ", url)
        print("Name: ",soup.find("h1").text)
        print("Title: ", soup.find("title").text)
        print("Excerp: ",soup.find("p").text)
        
        # Henter alle linker på siden og lagrer dem i en kø
        links = soup.find_all("a", href=True)
        text_file = open("Spider/queue.txt", "a")
        queue = []

        for link in links:
            link = link["href"]
            print(link)

            queue_file = open("Spider/queue.txt", "r")
            for line in queue_file.readlines():
                queue.append(line.strip())
            queue_file.close()

            # Legger til https:// osv foran linker som ikke begynner med det
            if link.startswith("/"):
                base_url = url
                if url.count("/") > 2:
                    parts = url.split('/', 3)
                    if len(parts) >= 4:
                        base_url = '/'.join(parts[:3])
                link = base_url + link
                if link not in queue:
                    text_file.write(link + "\n")
            
            # Sørger for at bare riktige linker blir lagt inn i køen
            if link.startswith("https://") and link not in queue:
                text_file.write(link + "\n")
        text_file.close()
    else:
        print("Url is in robots.txt and is not allowed to be scraped")

# Websiden som skal scrapes
URL = "https://quotes.toscrape.com"
# URL = "https://www.geeksforgeeks.org/data-structures/"
scrape(URL)