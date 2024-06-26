import requests as rq
from bs4 import BeautifulSoup as bs
from datetime import datetime
import time
from urllib.parse import urljoin, urlparse

# Tegn som den fjerner fra informasjonen som skal sendes til databasen
disallowed = ['"', ',', "'"]

# Setter alle filepathene som blir åpnet
queue_file_path= 'Spider/queue.txt'
scraped_file_path = 'Spider/scraped.txt'

# Funksjon som henter ut alt inneholdet i robots.txt filen
def check_robots(url):
    robots_url = url + '/robots.txt'

    # Sjekker om linken inneholder noen subsider og fjerner alle subsider + legger til robots.txt
    if url.count('/') > 2:
        parts = url.split('/', 3)
        if len(parts) >= 4:
            robots_url = '/'.join(parts[:3]) + '/robots.txt'
        # print(robots_url)

    # Sjekker om Robots.txt eksisterer
    response = rq.head(robots_url)
    if response.status_code == 200:
        print('Robots.txt found!')
        # Scraper robots.txt og sender inneholdet til en local txt fil
        req = rq.get(robots_url)
        robots_soup = bs(req.text, 'html.parser')

        # gjør om robots.txt til en array over alle sidene som ikke skal bli scrapet
        rules = []

        # Henter ut alle reglene i robots og lagrer dem i en array/liste
        is_user_agent_star = False
        for line in robots_soup.text.split('\n'):
            if line.startswith('User-agent'):
                user_agent = line.split(': ')[-1]
                if user_agent.strip() == '*' or user_agent.strip() == 'user_agent':
                    is_user_agent_star = True
                else:
                    is_user_agent_star = False
            elif is_user_agent_star and line.startswith('Disallow'):
                disallowed_path = line.split(': ')[-1]
                rules.append(disallowed_path.strip())

        # Sjekker om url-en er tillat i robots.txt
        page_path = '/' + '/'.join(url.split('/', 3)[3:])
        if page_path in rules:
            print('Page is in robots. Canceling scrape.')
            return True
        elif page_path not in rules:
            print('Page is not in robots. Begining scrape.')
            return False
    else:
        print('No Robots.txt!')
        return False

# Sender informasjonen fra siden til databasen gjennom api-en
def send_to_database(site_url, site_name, site_title, site_text):
    # Send info til databasen
    api = 'http://10.1.120.50:5000/post/site'
    data = {
        'url': site_url,
        'name': site_name,
        'title': site_title,
        'text': site_text
    }

    # Passer på at dataen som blir sendt til databasen ikke inneholder " eller ,
    for key, value in data.items():
        if value != None:
            cleaned_value = ''.join(char for char in value if char not in disallowed)
            data[key] = cleaned_value

    # Setter sammen url-en og sender informasjonen til api-en
    full_url = api + '?' + '&'.join([f'{key}={value}' for key, value in data.items()])
    response = rq.get(url=full_url)

    # Tar opp resultatet fra api spørringen og printer det til konsollen
    if response.status_code == 200:
        print('POST request successful!')
        print('Response:', response.text, '\n')
    else:
        print('POST request failed with status code:', response.status_code)
        print('Response:', response.text, '\n')

# Sender bilder til databasen
def send_img_to_api(parent_url, img_url, image_alt):
    api = 'http://10.1.120.50:5000/post/image'
    data = {
        'parentUrl': parent_url,
        'url': img_url,
        'alt': image_alt
    }

    # Passer på at dataen som blir sendt til databasen ikke inneholder " eller ,
    for key, value in data.items():
        if value != None:
            cleaned_value = ''.join(char for char in value if char not in disallowed)
            data[key] = cleaned_value

    # Setter sammen url-en og sender informasjonen til api-en
    full_url = api + '?' + '&'.join([f'{key}={value}' for key, value in data.items()])
    response = rq.get(url=full_url)

    if response.status_code == 200:
        print('Image POST request successful!', f'Parent URL: {parent_url}, IMG URL: {img_url}, IMG ALT: {image_alt}')
        print('Response:', response.text, '\n')
    else:
        print('Image POST request failed with status code:', response.status_code)
        print('Response:', response.text, '\n')

# Legger inn alle linkene i køen og formaterer dem ordentlig
def format_links(soup):
    # Henter alle linker på siden og lagrer dem i en kø
    links = soup.find_all('a', href=True)
    queue = []
    scraped = []
    for link in links:
        link = link['href']

        # Legger til https:// osv foran linker som ikke begynner med det
        if link.startswith('/'):
            base_url = url
            if url.count('/') > 2:
                parts = url.split('/', 3)
                if len(parts) >= 4:
                    base_url = '/'.join(parts[:3])
            if link.endswith('/'):
                link = link
            else:
                link + '/'
            link = base_url + link

        # Gjør om kø filen til en array
        queue_file = open(queue_file_path, 'r')
        for line in queue_file.readlines():
            queue.append(line.strip())
        queue_file.close()

        # Gjør om scraped filen til en array
        scraped_file = open(scraped_file_path, 'r')
        for line in scraped_file.readlines():
            scraped.append(line.strip())
        scraped_file.close()

        parsed_url = urlparse(link)
        link = parsed_url.scheme + '://' + parsed_url.netloc + parsed_url.path
        
        # Fjerner den siste '/'en i linken
        if link.endswith('/') == False:
            link = link + '/'

        # Sørger for at bare riktige linker blir lagt inn i køen
        if (link.startswith('https://') or link.startswith('http://')) and (link not in queue) and (link not in scraped) and (link != url):
            # print(link)
            with open(queue_file_path, 'a') as queue_text_file:
                queue_text_file.write(link + '\n')

def get_images(soup, parent_url):
    # hente alle bildene fra siden
    img_tags = soup.find_all('img')
    
    # henter ut bilde url-en og alt teksten
    image_urls = [img['src'] for img in img_tags]
    image_alts = [(img.get('alt')) for img in img_tags]

    # Sender bildene til databasen
    img_count = 0
    for img in image_urls:
        for alt in image_alts:
            if img and alt != None or img and alt != "":
                # print(img, alt)
                img_count += 1
                if img_count <= 50:
                    send_img_to_api(parent_url, img, alt)


# Funksjon som scraper siden og filtrerer ut den viktigste informasjonen
def scrape(url:str) -> None:
    url = url.strip().replace('  ', ' ').replace('\n', '')
    response = rq.head(url)

    # Sjekker om den får kontakt med siden
    if response.status_code != 200:
        print('Could not connect to url. Going to next in the queue\n')
        return

    # Kaller check_robots funksjonen som sjekker om url-en er i robots
    if check_robots(url):
        print('Url is in robots.txt and is not allowed to be scraped')
        return

    # Scraper url-en og henter ut riktig informasjon
    req = rq.get(url)
    soup = bs(req.text, 'html.parser')

    # Henter informasjonen fra siden som har blitt scrapet
    site_name = soup.find('h1')
    site_title = soup.find('title')
    site_text = soup.text
    scrape_date_logged = datetime.now().strftime('%d/%m/%Y %H:%M')

    # Sjekker at informasjonen som her hentet fra siden ikke er None og formaterer det ordentlig
    if site_name != None:
        site_name = soup.find('h1').text.strip().replace('  ', ' ').replace('\n', '')
    if site_title != None:
        site_title = soup.find('title').text.strip().replace('  ', ' ').replace('\n', '')
    if site_text != None:
        site_text = soup.text.strip().replace('  ', ' ').replace('\n', '')

    # Printer ut informasjonen til consolen
    print('Important info from scrape:')
    print('URL:', url)
    print('Name:', site_name)
    print('Title:', site_title)
    # print('Text:', site_text)
    print('Date Logged:', scrape_date_logged, '\n')

    # Kaller funksjonen som sender informasjonen til databasen
    send_to_database(url, site_name, site_title, site_text)

    # Kaller funksjonen som sender linker til køen og formaterer dem
    format_links(soup)

    # Kaller funksjonen som henter alle bildene og sender dem til databasen
    get_images(soup, url)

    # Legger linken som har blitt scrapet inn i en tekst fil over linker som har blitt scrapet
    scraped_text_file = open(scraped_file_path, 'a')
    scraped_text_file.write(url + '\n')
    scraped_text_file.close()

lines = []
while True:
    with open (queue_file_path, 'r+') as file:
        lines = file.readlines()
        if lines:
            # Henter første url-en i køen
            url = lines[0].strip()
            # Fjerner url-en som skal scrapes fra køen
            file.seek(0)
            file.truncate()
            file.writelines(lines[1:])
            # Kaller scrape functionen som skal scrape url-en
            scrape(url)
        else:
            print('Queue is empty. Waiting for URLs...')
    file.close()
    time.sleep(2) # Venter 5 sek før neste scrape