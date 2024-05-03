import requests as rq,mysql.connector
from bs4 import BeautifulSoup as bs

# Websiden som skal scrapes
URL = "https://quotes.toscrape.com"

# Funksjon som henter ut alt inneholdet i robots.txt filen
def get_robots(url):
    parts = url.split('/', 3)
    if len(parts) >= 4:
        robots_url = '/'.join(parts[:3]) + "/robots.txt"
    req = rq.get(robots_url)
    robots_soup = bs(req.text, "html.parser")
    return robots_soup
    

# Funksjon som scraper siden og filtrerer ut den viktigste informasjonen
def scrape(url:str) -> None:
    req = rq.get(url)
    soup = bs(req.text, 'html.parser')
    print("URL: ", url)
    print("Name: ",soup.find("h1").text)
    print("Title: ", soup.find("title").text)
    print("Excerp: ",soup.find("p").text)
    
    # Henter alle linker på siden og lagrer dem i en kø
    links = soup.find_all("a", href=True)

    text_file = open("Spider/queue.txt", "w")
    for link in links:
        link = link["href"]
        if link.startswith("https://"):
            text_file.write(link + "\n")
    text_file.close()


scrape(URL)
# robots = get_robots(URL)
# print(robots)