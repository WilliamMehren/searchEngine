import requests as rq,mysql.connector
from bs4 import BeautifulSoup as bs

# Funksjon som henter ut alt inneholdet i robots.txt filen
def check_robots(url):
    # Sjekker om linken inneholder noen subsider og fjerner alle subsider + legger til robots.txt
    if url.count("/") > 2:
        parts = url.split('/', 3)
        if len(parts) >= 4:
            parsed_url = '/'.join(parts[:3])
            robots_url = '/'.join(parts[:3]) + "/robots.txt"

    # Scraper robots.txt og sender inneholdet til en local txt fil
    req = rq.get(robots_url)
    robots_soup = bs(req.text, "html.parser")
    # print(robots_soup)

    rules = []
    for line in robots_soup.text.split('\n'):
        if line.startswith('User-agent'):
            agent = line.split(': ')[-1]
            if agent == "user_agent" or agent == '*':
                rules = []
        rules.append(line.strip())
    
    # Check if the URL is allowed for the user-agent
        for line in rules:
            if line.startswith('Disallow'):
                disallow_path = line.split(': ')[-1]
                if disallow_path == '/':
                    return False  # Disallowed for all paths
                elif parsed_url.path.startswith(disallow_path):
                    return True   # Disallowed for the specified path
        return False  # Allowed if no matching Disallow rule found
    

# Funksjon som scraper siden og filtrerer ut den viktigste informasjonen
def scrape(url:str) -> None:
    if check_robots(url) == False:
        # Ikke legge til linker i køen som allered er der
        # Ikke legge til linker i køen som har blitt scrapet nylig (Hent scrapetid fra database)
        # Oppdater så den henter riktig informasjon som excerp

        req = rq.get(url)
        soup = bs(req.text, 'html.parser')
        print("Important info from site:")
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
    else:
        print("Urls is in robots.txt and is not allowed to be scraped")

# Websiden som skal scrapes
# URL = "https://quotes.toscrape.com"
URL = "https://www.geeksforgeeks.org/data-structures/"
scrape(URL)