import requests as rq,mysql.connector
from bs4 import BeautifulSoup as bs

# Websiden som skal scrapes
URL = "https://www.geeksforgeeks.org/data-structures/"

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
    print("Name: ", soup.find("title").text)
    print(soup.find("h1").text)
    print(soup.find(class_="article-text").text)

scrape(URL)
# robots = get_robots(URL)
# print(robots)