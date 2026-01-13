```markdown
# Technical Test

## User Story

**<Creative Agency User>** want **<to create a new show reel from a collection of clips>** in order to **<present my agency commercials to the advertiser>**.

---

## Background

- A show reel has:
  - name
  - video standard
  - video definition
  - total duration expressed as timecode (`hh:mm:ss:ff`)
- Video standard is either **PAL** or **NTSC**
- Video definition is **SD** or **HD**
- A show reel can have **1 or more video clips**
- A video clip has:
  - name
  - description
  - video standard
  - video definition
  - start timecode
  - end timecode
- A timecode is expressed as `HH:MM:ss:ff`
  - `HH` → hours
  - `MM` → minutes
  - `ss` → seconds
  - `ff` → frames
- PAL video has **25 fps** (25 frames per second), i.e. **1 frame = 40 milliseconds**
- NTSC video has **30 fps**

---

## Requirements

- Create a proof of concept user interface for the customer
- The UI should show the complete duration of all the clips in the show reel
- The UI should allow me to give my show reel a name
- The UI should allow me to add and remove clips from a list
  - This should update the total duration
- One cannot mix video standards and video definitions in a video reel
  - NTSC clips cannot be added to a PAL video reel
  - HD clips cannot be added to a SD video reel

---

## Technical Notes

- Development time is **1 day**
- Server-side language must be **Ruby on Rails**
- Web view must be built with **React.js**
- Store the deliverables in a repository on your **GitHub** account
- Deploy on **AWS**, **GCP**, or any other infrastructure to verify it works
- Generic functions created will be used by other applications
  - Ensure enough abstraction (e.g. `Timecode` class reusable in other projects)
- We are looking at **code quality and thought process**
  - An unfinished solution with quality code is preferred over a rushed complete application

---

## Data

### Clip 1

- **Name:** Bud Light
- **Description:** A factory is working on the new Bud Light Platinum.
- **Standard:** PAL
- **Definition:** SD
- **Start:** `00:00:00:00`
- **End:** `00:00:30:12`

### Clip 2

- **Name:** M&M's
- **Description:** At a party, a brown shelled M&M is mistaken for being naked. As a result, the red M&M tears off its skin and dances to _"Sexy and I Know It"_ by LMFAO.
- **Standard:** NTSC
- **Definition:** SD
- **Start:** `00:00:00:00`
- **End:** `00:00:15:27`

### Clip 3

- **Name:** Audi
- **Description:** A group of vampires are having a party in the woods. The vampire in charge of drinks (blood types) arrives in his Audi. The bright lights of the car kill all of the vampires, with him wondering where everyone went afterwards.
- **Standard:** PAL
- **Definition:** SD
- **Start:** `00:00:00:00`
- **End:** `00:01:30:00`

### Clip 4

- **Name:** Fiat
- **Description:** A man walks through a street to discover a beautiful woman (Catrinel Menghia) standing on a parking space, who proceeds to approach and seduce him. When successfully doing so, he then discovers he was about to kiss a Fiat 500 Abarth.
- **Standard:** NTSC
- **Definition:** SD
- **Start:** `00:00:00:00`
- **End:** `00:00:18:11`

### Clip 5

- **Name:** Pepsi
- **Description:** People in the Middle Ages try to entertain their king (Elton John) for a Pepsi. While the first person fails, a mysterious person (Season 1 X Factor winner Melanie Amaro) wins the Pepsi by singing Aretha Franklin's _"Respect"_. After she wins, she overthrows the king and gives Pepsi to all the town.
- **Standard:** NTSC
- **Definition:** SD
- **Start:** `00:00:00:00`
- **End:** `00:00:20:00`

### Clip 6

- **Name:** Best Buy
- **Description:** An ad featuring the creators of the camera phone, Siri, and the first text message. The creators of Words with Friends also appear parodying the incident involving Alec Baldwin playing the game on an airplane.
- **Standard:** PAL
- **Definition:** HD
- **Start:** `00:00:00:00`
- **End:** `00:00:10:05`

### Clip 7

- **Name:** Captain America: The First Avenger
- **Description:** Video Promo
- **Standard:** PAL
- **Definition:** HD
- **Start:** `00:00:00:00`
- **End:** `00:00:20:10`

### Clip 8

- **Name:** Volkswagen "Black Beetle"
- **Description:** A computer-generated black beetle runs fast, referencing the new Volkswagen model.
- **Standard:** NTSC
- **Definition:** HD
- **Start:** `00:00:00:00`
- **End:** `00:00:30:00`

---

## Acceptance Tests

### 1

**Given** I navigate to the user interface and create a **PAL SD Video Reel**  
**When** I try to add an **NTSC SD** video clip  
**Then** the user interface should prevent me from doing this action

**Result:** OK / NG

### 2

**Given** I navigate to the user interface and create a **PAL SD Video Reel**  
**When** I try to add a **PAL HD** video clip  
**Then** the user interface should prevent me from doing this action

**Result:** OK / NG

### 3

**Given** I navigate to the user interface and create a **PAL SD Video Reel**  
**When** I add all the **PAL SD** video clips  
**Then** the total duration displayed is `00:02:11:01`

**Result:** OK / NG

### 4

**Given** I navigate to the user interface and create a **NTSC SD Video Reel**  
**When** I add all the **NTSC SD** video clips  
**Then** the total duration displayed is `00:00:54:08`

**Result:** OK / NG
```
