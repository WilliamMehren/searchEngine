import requests as rq,mysql.connector
from bs4 import BeautifulSoup as bs

URL = "https://snl.no/ost"


def scrape(url:str) -> None:
    req = rq.get(url)
    soup = bs(req.text, 'html.parser')  
    print(soup.find("title").text)
    print(soup.find("h1").text)
    print(soup.find(class_="article-text").text)

scrape(URL)