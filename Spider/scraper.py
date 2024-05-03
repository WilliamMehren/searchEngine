import requests as rq,mysql.connector
from bs4 import BeautifulSoup as bs

# Websiden som skal scrapes
# URL = "https://quotes.toscrape.com"
URL = "https://www.geeksforgeeks.org/data-structures/"

# Funksjon som henter ut alt inneholdet i robots.txt filen
def check_robots(url):
    # Sjekker om linken inneholder noen subsider
    if url.count("/") > 2:
        # Henter linken til nettsiden uten noen subsider
        parts = url.split('/', 3)
        if len(parts) >= 4:
            robots_url = '/'.join(parts[:3]) + "/robots.txt"

    # Scraper robots.txt og sender inneholdet til en .txt fil
    req = rq.get(robots_url)
    robots_soup = bs(req.text, "html.parser")
    robots_array = [text.strip() for text in robots_soup.stripped_strings]

    # Converterer url-en til og bare være subsidene
    if url.count("/") > 2:
        parts = url.split('/', 3)
        if len(parts) >= 4:
            compare_url = '/'.join(parts[:3]) + "/robots.txt"
    
    for i in robots_array:
        print(i)

# Funksjon som scraper siden og filtrerer ut den viktigste informasjonen
def scrape(url:str) -> None:
    # todo:
    # Sjekke om url-en er i "robots.txt"
    check_robots(url)
    # Ikke legge til linker i køen som allered er der
    # Ikke legge til linker i køen som har blitt scrapet nylig (Hent scrapetid fra database)
    # Oppdater så den henter riktig informasjon som excerp

    req = rq.get(url)
    soup = bs(req.text, 'html.parser')
    print("URL: ", url)
    print("Name: ",soup.find("h1").text)
    print("Title: ", soup.find("title").text)
    print("Excerp: ",soup.find("p").text)
    
    # Henter alle linker på siden og lagrer dem i en kø
    links = soup.find_all("a", href=True)
    text_file = open("Spider/queue.txt", "a")

    for link in links:
        link = link["href"]
        # Legger til https:// osv foran linker som ikke begynner med det
        if link.startswith("/"):
            base_url = url
            if url.count("/") > 2:
                parts = url.split('/', 3)
                if len(parts) >= 4:
                    base_url = '/'.join(parts[:3])
            link = base_url + link
            text_file.write(link + "\n")
        
        # Sørger for at bare riktige linker blir lagt inn i køen
        if link.startswith("https://"):
            text_file.write(link + "\n")

    text_file.close()

scrape(URL)