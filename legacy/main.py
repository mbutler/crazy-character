import json
import random
from typing import List, Dict

#import mutate

with open('firstname-list.json', 'r') as f:
    firstnames = json.load(f)

with open('surname-list.json', 'r') as f:
    lastnames = json.load(f)

with open('attributes-list.json', 'r') as f:
    attributes = json.load(f)

with open('spell-list.json', 'r') as f:
    spells = json.load(f)

with open('skill-list.json', 'r') as f:
    skills = json.load(f)

with open('missions-list.json', 'r') as f:
    missions = json.load(f)

with open('story-list.json', 'r') as f:
    stories = json.load(f)

with open('conditions-list.json', 'r') as f:
    conditions = json.load(f)

with open('armor-list.json', 'r') as f:
    armor = json.load(f)

with open('location-list.json', 'r') as f:
    locations = json.load(f)

with open('weapon-list.json', 'r') as f:
    weapons = json.load(f)

with open('martialarts-list.json', 'r') as f:
    martialarts = json.load(f)

def epic_weapon() -> str:
    weapon = random.choice(weapons) + " of " + random.choice(skills)
    return weapon

def quest() -> Dict[str, str]:
    q = {}
    q['story'] = random.choice(stories)
    q['locations'] = random.choice(locations)
    q['mission'] = random.choice(missions)
    return q

def spawn() -> Dict[str, str]:
    attributeList = random.sample(attributes, 6)
    agent = {}
    agent['name'] = f"{random.choice(firstnames)} {random.choice(lastnames)}"
    #agent['spirit_animal'] = mutate.create()    
    agent['attributes'] = [{'name': attr, 'value': random.randint(1, 100)} for attr in attributeList]
    agent['weapons'] = random.sample(weapons, 1)
    agent['armor'] = random.sample(armor, 1)
    agent['skills'] = random.sample(skills, 1)
    agent['spells'] = random.sample(spells, 1)
    agent['martialarts'] = random.sample(martialarts, 1)
    agent['epicWeapon'] = epic_weapon()
    agent['quest'] = quest()
    return agent

print(json.dumps(spawn(), indent=4))
