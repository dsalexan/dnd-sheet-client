<template>
  <div class="sheet">     
    <form class="charsheet">
      <header>
        <section class="charname">
          <label for="charname">Character Name</label><input name="charname" placeholder="Thoradin Fireforge" />
        </section>
        <section class="misc">
          <ul>
            <li>
              <label for="classlevel">Class & Level</label><input name="classlevel" placeholder="Paladin 2" />
            </li>
            <li>
              <label for="background">Background</label><input name="background" placeholder="Acolyte" />
            </li>
            <li>
              <label for="playername">Player Name</label><input name="playername" placeholder="Player McPlayerface">
            </li>
            <li>
              <label for="race">Race</label><input name="race" placeholder="Half-elf" />
            </li>
            <li>
              <label for="alignment">Alignment</label><input name="alignment" placeholder="Lawful Good" />
            </li>
            <li>
              <label for="experiencepoints">Experience Points</label><input name="experiencepoints" placeholder="3240" />
            </li>
          </ul>
        </section>
      </header>
      <main>
        <section>
          <section class="attributes">
            <div class="scores">
              <ul>
                <li>
                  <div class="score">
                    <label for="Strengthscore">Strength</label><input name="Strengthscore" placeholder="10"
                      class="stat" />
                  </div>
                  <div class="modifier">
                    <input name="Strengthmod" placeholder="+0" class="statmod" />
                  </div>
                </li>
                <li>
                  <div class="score">
                    <label for="Dexterityscore">Dexterity</label><input name="Dexterityscore" placeholder="10"
                      class="stat" />
                  </div>
                  <div class="modifier">
                    <input name="Dexteritymod" placeholder="+0" class=statmod />
                  </div>
                </li>
                <li>
                  <div class="score">
                    <label for="Constitutionscore">Constitution</label><input name="Constitutionscore" placeholder="10"
                      class="stat" />
                  </div>
                  <div class="modifier">
                    <input name="Constitutionmod" placeholder="+0" class="statmod" />
                  </div>
                </li>
                <li>
                  <div class="score">
                    <label for="Wisdomscore">Wisdom</label><input name="Wisdomscore" placeholder="10" class="stat" />
                  </div>
                  <div class="modifier">
                    <input name="Wisdommod" placeholder="+0" />
                  </div>
                </li>
                <li>
                  <div class="score">
                    <label for="Intelligencescore">Intelligence</label><input name="Intelligencescore" placeholder="10"
                      class="stat" />
                  </div>
                  <div class="modifier">
                    <input name="Intelligencemod" placeholder="+0" class="statmod" />
                  </div>
                </li>
                <li>
                  <div class="score">
                    <label for="Charismascore">Charisma</label><input name="Charismascore" placeholder="10"
                      class="stat" />
                  </div>
                  <div class="modifier">
                    <input name="Charismamod" placeholder="+0" class="statmod" />
                  </div>
                </li>
              </ul>
            </div>
            <div class="attr-applications">
              <div class="inspiration box">
                <div class="label-container">
                  <label for="inspiration">Inspiration</label>
                </div>
                <input name="inspiration" type="checkbox" />
              </div>
              <div class="proficiencybonus box">
                <div class="label-container">
                  <label for="proficiencybonus">Proficiency Bonus</label>
                </div>
                <input name="proficiencybonus" placeholder="+2" />
              </div>
              <div class="saves list-section box">
                <ul>
                  <li>
                    <label for="Strength-save">Strength</label><input name="Strength-save" placeholder="+0"
                      type="text" /><input name="Strength-save-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Dexterity-save">Dexterity</label><input name="Dexterity-save" placeholder="+0"
                      type="text" /><input name="Dexterity-save-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Constitution-save">Constitution</label><input name="Constitution-save" placeholder="+0"
                      type="text" /><input name="Constitution-save-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Wisdom-save">Wisdom</label><input name="Wisdom-save" placeholder="+0" type="text" /><input
                      name="Wisdom-save-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Intelligence-save">Intelligence</label><input name="Intelligence-save" placeholder="+0"
                      type="text" /><input name="Intelligence-save-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Charisma-save">Charisma</label><input name="Charisma-save" placeholder="+0"
                      type="text" /><input name="Charisma-save-prof" type="checkbox" />
                  </li>
                </ul>
                <div class="label">
                  Saving Throws
                </div>
              </div>
              <div class="skills list-section box">
                <ul>
                  <li>
                    <label for="Acrobatics">Acrobatics <span class="skill">(Dex)</span></label><input name="Acrobatics"
                      placeholder="+0" type="text" /><input name="Acrobatics-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Animal Handling">Animal Handling <span class="skill">(Wis)</span></label><input
                      name="Animal Handling" placeholder="+0" type="text" /><input name="Animal Handling-prof"
                      type="checkbox" />
                  </li>
                  <li>
                    <label for="Arcana">Arcana <span class="skill">(Int)</span></label><input name="Arcana"
                      placeholder="+0" type="text" /><input name="Arcana-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Athletics">Athletics <span class="skill">(Str)</span></label><input name="Athletics"
                      placeholder="+0" type="text" /><input name="Athletics-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Deception">Deception <span class="skill">(Cha)</span></label><input name="Deception"
                      placeholder="+0" type="text" /><input name="Deception-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="History">History <span class="skill">(Int)</span></label><input name="History"
                      placeholder="+0" type="text" /><input name="History-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Insight">Insight <span class="skill">(Wis)</span></label><input name="Insight"
                      placeholder="+0" type="text" /><input name="Insight-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Intimidation">Intimidation <span class="skill">(Cha)</span></label><input
                      name="Intimidation" placeholder="+0" type="text" /><input name="Intimidation-prof"
                      type="checkbox" />
                  </li>
                  <li>
                    <label for="Investigation">Investigation <span class="skill">(Int)</span></label><input
                      name="Investigation" placeholder="+0" type="text" /><input name="Investigation-prof"
                      type="checkbox" />
                  </li>
                  <li>
                    <label for="Medicine">Medicine <span class="skill">(Wis)</span></label><input name="Medicine"
                      placeholder="+0" type="text" /><input name="Medicine-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Nature">Nature <span class="skill">(Int)</span></label><input name="Nature"
                      placeholder="+0" type="text" /><input name="Nature-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Perception">Perception <span class="skill">(Wis)</span></label><input name="Perception"
                      placeholder="+0" type="text" /><input name="Perception-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Performance">Performance <span class="skill">(Cha)</span></label><input name="Performance"
                      placeholder="+0" type="text" /><input name="Performance-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Persuasion">Persuasion <span class="skill">(Cha)</span></label><input name="Persuasion"
                      placeholder="+0" type="text" /><input name="Persuasion-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Religion">Religion <span class="skill">(Int)</span></label><input name="Religion"
                      placeholder="+0" type="text" /><input name="Religion-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Sleight of Hand">Sleight of Hand <span class="skill">(Dex)</span></label><input
                      name="Sleight of Hand" placeholder="+0" type="text" /><input name="Sleight of Hand-prof"
                      type="checkbox" />
                  </li>
                  <li>
                    <label for="Stealth">Stealth <span class="skill">(Dex)</span></label><input name="Stealth"
                      placeholder="+0" type="text" /><input name="Stealth-prof" type="checkbox" />
                  </li>
                  <li>
                    <label for="Survival">Survival <span class="skill">(Wis)</span></label><input name="Survival"
                      placeholder="+0" type="text" /><input name="Survival-prof" type="checkbox" />
                  </li>
                </ul>
                <div class="label">
                  Skills
                </div>
              </div>
            </div>
          </section>
          <div class="passive-perception box">
            <div class="label-container">
              <label for="passiveperception">Passive Wisdom (Perception)</label>
            </div>
            <input name="passiveperception" placeholder="10" />
          </div>
          <div class="otherprofs box textblock">
            <label for="otherprofs">Other Proficiencies and Languages</label><textarea name="otherprofs"></textarea>
          </div>
        </section>
        <section>
          <section class="combat">
            <div class="armorclass">
              <div>
                <label for="ac">Armor Class</label><input name="ac" placeholder="10" type="text" />
              </div>
            </div>
            <div class="initiative">
              <div>
                <label for="initiative">Initiative</label><input name="initiative" placeholder="+0" type="text" />
              </div>
            </div>
            <div class="speed">
              <div>
                <label for="speed">Speed</label><input name="speed" placeholder="30" type="text" />
              </div>
            </div>
            <div class="hp">
              <div class="regular">
                <div class="max">
                  <label for="maxhp">Hit Point Maximum</label><input name="maxhp" placeholder="10" type="text" />
                </div>
                <div class="current">
                  <label for="currenthp">Current Hit Points</label><input name="currenthp" type="text" />
                </div>
              </div>
              <div class="temporary">
                <label for="temphp">Temporary Hit Points</label><input name="temphp" type="text" />
              </div>
            </div>
            <div class="hitdice">
              <div>
                <div class="total">
                  <label onclick="totalhd_clicked()" for="totalhd">Total</label><input name="totalhd" placeholder="2d10"
                    type="text" />
                </div>
                <div class="remaining">
                  <label for="remaininghd">Hit Dice</label><input name="remaininghd" type="text" />
                </div>
              </div>
            </div>
            <div class="deathsaves">
              <div>
                <div class="label">
                  <label>Death Saves</label>
                </div>
                <div class="marks">
                  <div class="deathsuccesses">
                    <label>Successes</label>
                    <div class="bubbles">
                      <input name="deathsuccess1" type="checkbox" />
                      <input name="deathsuccess2" type="checkbox" />
                      <input name="deathsuccess3" type="checkbox" />
                    </div>
                  </div>
                  <div class="deathfails">
                    <label>Failures</label>
                    <div class="bubbles">
                      <input name="deathfail1" type="checkbox" />
                      <input name="deathfail2" type="checkbox" />
                      <input name="deathfail3" type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="attacksandspellcasting">
            <div>
              <label>Attacks & Spellcasting</label>
              <table>
                <thead>
                  <tr>
                    <th>
                      Name
                    </th>
                    <th>
                      Atk Bonus
                    </th>
                    <th>
                      Damage/Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input name="atkname1" type="text" />
                    </td>
                    <td>
                      <input name="atkbonus1" type="text" />
                    </td>
                    <td>
                      <input name="atkdamage1" type="text" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input name="atkname2" type="text" />
                    </td>
                    <td>
                      <input name="atkbonus2" type="text" />
                    </td>
                    <td>
                      <input name="atkdamage2" type="text" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input name="atkname3" type="text" />
                    </td>
                    <td>
                      <input name="atkbonus3" type="text" />
                    </td>
                    <td>
                      <input name="atkdamage3" type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <textarea></textarea>
            </div>
          </section>
          <section class="equipment">
            <div>
              <label>Equipment</label>
              <div class="money">
                <ul>
                  <li>
                    <label for="cp">cp</label><input name="cp" />
                  </li>
                  <li>
                    <label for="sp">sp</label><input name="sp" />
                  </li>
                  <li>
                    <label for="ep">ep</label><input name="ep" />
                  </li>
                  <li>
                    <label for="gp">gp</label><input name="gp" />
                  </li>
                  <li>
                    <label for="pp">pp</label><input name="pp" />
                  </li>
                </ul>
              </div>
              <textarea placeholder="Equipment list here"></textarea>
            </div>
          </section>
        </section>
        <section>
          <section class="flavor" style="display: none">
            <div class="personality">
              <label for="personality">Personality</label><textarea name="personality"></textarea>
            </div>
            <div class="ideals">
              <label for="ideals">Ideals</label><textarea name="ideals"></textarea>
            </div>
            <div class="bonds">
              <label for="bonds">Bonds</label><textarea name="bonds"></textarea>
            </div>
            <div class="flaws">
              <label for="flaws">Flaws</label><textarea name="flaws"></textarea>
            </div>
          </section>
          <section class="features">
            <div>
              <label for="features">Features & Traits</label><textarea name="features"></textarea>
            </div>
          </section>
        </section>
      </main>
    </form>
  </div>
</template>

<script>

export default {
  name: 'sheet',
  components: {
  }
}
</script>

<style lang="sass" scoped>
  $sheet-width: 1000px
  $bg: white
  $faded: #ddd
  $faded-light: #eee
  $faded-dark: #bbb
  $radius: 10px
  $gutter: 10px
  $bubble-size: 10px
  $small-box-width: 30px
  $large-box-width: 70px

  .red
    background: red
    
  .blue
    background: blue
    
  .hide
    display: none !important
    
  textarea
    font-size: 12px
    text-align: left
    width: calc(100% - #{$radius*2} - 2px)
    width: 100%
    border-radius: $radius
    padding: $radius
    resize: none
    overflow: hidden
    height: 15em
    
  input[type="checkbox"]
    cursor: pointer

  div.box
    margin-top: $gutter

  form.charsheet
    width: $sheet-width
    right: 0
    left: 0
    margin-right: auto
    margin-left: auto
    margin-top: 10px
    
    div.textblock
      display: flex
      flex-direction: column-reverse
      width: 100%
      align-items: center
      
      label
        text-align: center
        border: 1px solid black
        border-top: 0
        font-size: 10px
        width: calc(100% - #{$radius*2} - 2px)
        border-radius: 0 0 $radius $radius
        padding: 4px 0
        font-weight: bold

      textarea
        border: 1px solid black

    ul
      margin: 0
      padding: 0

      li
        list-style-image: none
        display: block

    ::placeholder
      color: $faded-dark
    
    label
      text-transform: uppercase
      font-size: 12px
    
    header
      display: flex
      align-contents: stretch
      align-items: stretch
      
      section.charname
        border: 1px solid black
        border-right: 0
        border-radius: $radius 0 0 $radius
        padding: 5px 0
        background-color: $faded-light
        width: 30%
        display: flex
        flex-direction: column-reverse
        bottom: 0
        top: 0
        margin: auto
        
        input
          padding: 0.5em
          margin: 5px
          border: 0
          
        label
          padding-left: 1em
      
      section.misc
        width: 70%
        border: 1px solid black
        border-radius: $radius
        padding-left: 1em
        padding-right: 1em
        
        ul
          padding: 10px 0px 5px 0px
          display: flex
          flex-wrap: wrap
          
          li
            width: 33.33333%
            display: flex
            flex-direction: column-reverse
            
            label
              margin-bottom: 5px

            input
              border: 0
              border-bottom: 1px solid $faded
    main
      display: flex
      justify-content: space-between
      margin-top: $gutter*2
    
      div.label-container
        position: relative
        width: 100%
        height: $small-box-width - $radius - 2px
        margin-top: $radius / 2 + 1px
        border: 1px solid black
        border-left: 0
        text-align: center

        > label
          position: absolute
          left: 0
          top: 1px
          transform: translate(0%, 50%)
          width: 100%
          font-size: 8px

      > section
        width: 32%
        display: flex
        flex-direction: column
        
        section.attributes
          $attr-width: 70px
          $attr-height: 80px
          $attr-gutter: 31px
          width: 100%
          display: flex
          flex-direction: row
          justify-content: space-between
          
          div.scores
            width: $attr-width + $attr-gutter
            background-color: $faded-dark
            border-radius: $radius
            padding-bottom: $gutter / 2
            display: flex
            flex-direction: column
            justify-content: center

            label
              font-size: 8px
              font-weight: bold

            ul
              display: flex
              flex-direction: column
              justify-content: space-around
              align-items: center
              height: 100%

              li
                height: $attr-height
                width: $attr-width
                display: flex
                flex-direction: column

                input
                  width: 100%
                  padding: 0
                  border: 0

                div.score
                  background-color: $bg
                  border: 1px solid black
                  text-align: center
                  border-radius: $radius
                  padding-bottom: $radius

                  input
                    text-align: center
                    font-size: 40px
                    padding: 2px 0px 0px 0px
                    background: transparent
                    border: none

                div.modifier
                  margin-top: -$radius
                  text-align: center

                  input
                    background: $bg
                    width: $radius*3
                    height: $radius*2
                    border: 1px inset black
                    border-radius: $radius*2
                    margin: -1px
                    text-align: center
                    
          div.attr-applications
            flex-grow: 1
            margin-left: 10px
              
            div.inspiration
              display: flex
              flex-direction: row-reverse
              justify-content: flex-end
              
              input
                appearance: none
                border: 1px solid black
                padding: $small-box-width / 2
                border-radius: $radius

                &[type="checkbox"]
                  &:checked
                    background-color: black

            div.proficiencybonus
              display: flex
              flex-direction: row-reverse
              justify-content: flex-end

              input
                width: $small-box-width
                height: $small-box-width - 2
                border: 1px solid black
                text-align: center
                border-radius: $radius

            div.list-section
              border: 1px solid black
              border-radius: $radius
              padding: $gutter $gutter/2
              
              div.label
                margin-top: $gutter
                margin-bottom: $gutter / 4
                text-align: center
                text-transform: uppercase
                font-size: 10px
                font-weight: bold
              
              ul li
                display: flex
                align-items: center

                > *
                  margin-left: $gutter / 2

                label
                  text-transform: none
                  font-size: 8px
                  text-align: left
                  order: 3
                  
                  span.skill
                    color: $faded-dark

                input
                  &[type="text"]
                    width: 30px
                    font-size: 12px
                    text-align: center
                    border: 0
                    border-bottom: 1px solid black
                    order: 2
                  &[type="checkbox"]
                    appearance: none
                    width: $bubble-size
                    height: $bubble-size
                    border: 1px solid black
                    border-radius: $bubble-size
                    order: 1
                    &:checked
                      background-color: black

        
        
        div.passive-perception
          display: flex
          flex-direction: row-reverse
          justify-content: flex-end

          div.label-container
            height: 16px
            margin-top: 5px

            label            
              line-height: 1

          input
            width: $small-box-width
            height: $small-box-width - 2px
            text-align: center
            border: 1px solid black
            border-radius: $radius

        div.otherprofs textarea
          height: 26em
          width: 100%
            
      section.combat
        background-color: $faded-light
        display: flex
        flex-wrap: wrap
        border-radius: $radius
        
        > div
          overflow: hidden
          
          &.armorclass, &.initiative, &.speed
            flex-basis: 33.333%
            
            > div
              display: flex
              flex-direction: column-reverse
              align-items: center
              margin-top: $gutter
              
              label
                font-size: 8px
                width: $large-box-width - $radius*2
                border: 1px solid black
                border-top: 0
                background-color: $bg
                text-align: center
                padding-top: 5px
                padding-bottom: 5px
                border-radius: 0 0 $radius $radius

              input
                height: $large-box-width
                width: $large-box-width
                border-radius: $radius
                border: 1px solid black
                text-align: center
                font-size: 30px
        
          &.hp
            flex-basis: 100%
            
            > div.regular
              background-color: $bg
              border: 1px solid black
              margin: $gutter
              margin-bottom: $gutter / 2
              border-radius: $radius $radius 0 0
              
              > div.max
                display: flex
                justify-content: space-around
                align-items: baseline
                
                label
                  font-size: 10px
                  text-transform: none
                  color: $faded-dark
                
                input
                  width: 40%
                  border: 0
                  border-bottom: 1px solid $faded
                  font-size: 12px
                  text-align: center

              > div.current
                display: flex
                flex-direction: column-reverse

                input
                  border: 0
                  width: 100%
                  padding: 1em 0
                  font-size: 20px
                  text-align: center

                label
                  font-size: 10px
                  padding-bottom: 5px
                  text-align: center
                  font-weight: bold
                  
            > div.temporary
              margin: $gutter
              margin-top: 0
              border: 1px solid black
              border-radius: 0 0 $radius $radius
              display: flex
              flex-direction: column-reverse
              background-color: $bg
              
              input
                padding: 1em 0
                font-size: 20px
                border: 0
                text-align: center

              label
                font-size: 10px
                padding-bottom: 5px
                text-align: center
                font-weight: bold
                
          &.hitdice, &.deathsaves
            $height: 100px
            flex: 1 50%
            height: $height
            
            > div
              height: $height - $gutter*2
            
          &.hitdice > div
            background-color: $bg
            margin: $gutter
            border: 1px solid black
            border-radius: $radius
            display: flex
            flex-direction: column

            > div.total
              display: flex
              align-items: baseline
              justify-content: space-around
              padding: $gutter/2 0
              
              label
                font-size: 10px
                color: $faded-dark
                margin: 0.25em
                text-transform: none
                
              input
                font-size: 12px
                flex-grow: 1
                border: 0
                border-bottom: 1px solid $faded
                width: 50%
                margin-right: 0.25em
                padding: 0 0.25em
                text-align: center
                
            > div.remaining
              flex: 1
              display: flex
              flex-direction: column-reverse

              label
                text-align: center
                padding: 2px
                font-size: 10px
                
              input
                text-align: center
                border: 0
                flex: 1

          &.deathsaves
            > div
              margin: $gutter
              background: $bg
              border: 1px solid black
              border-radius: $radius
              display: flex
              flex-direction: column-reverse
              
              > div.label
                text-align: center
                
                label
                  font-size: 10px
                  
              > div.marks
                display: flex
                flex: 1
                flex-direction: column
                justify-content: center
                
                div.deathsuccesses, div.deathfails
                  display: flex
                  align-items: center

                  > *

                  label
                    font-size: 8px
                    text-align: right
                    flex: 1 50%
            
              div.bubbles
                flex: 1 40%
                margin-left: $gutter / 2

                input[type="checkbox"]
                  appearance: none
                  width: $bubble-size
                  height: $bubble-size
                  border: 1px solid black
                  border-radius: $bubble-size
                  &:checked
                    background-color: black
                  
      section.attacksandspellcasting
        border: 1px solid black
        border-radius: $radius
        margin-top: $gutter
        
        > div
          margin: $gutter
          display: flex
          flex-direction: column
        
          > label
            order: 3
            text-align: center

          > table
            width: 100%
            
            th
              font-size: 10px
              color: $faded
            
            input
              width: calc(100% - 4px)
              border: 0
              background-color: $faded-light
              font-size: 10px
              padding: 3px
              
          textarea
            border: 0
            width: calc(100% - (2 * #{$radius}))
            margin-bottom: $radius

      section.equipment
        border: 1px solid black
        border-radius: $radius
        margin-top: $gutter
        
        > div
          padding: $gutter
          display: flex
          flex-direction: row
          flex-wrap: wrap
          
          > div.money
            $labelwidth: 20px
            $labelpadding: 3px
            ul
              display: flex
              flex-direction: column
              justify-content: space-between
              height: 100%
              > li
                display: flex
                align-items: center
                label
                  border: 1px solid black
                  border-radius: $radius 0 0 $radius
                  border-right: 0
                  width: $labelwidth
                  font-size: 8px
                  text-align: center
                  padding: $labelpadding 0
                input
                  border: 1px solid black
                  border-radius: $radius
                  width: 40px
                  padding: 10px 3px
                  font-size: 12px
                  text-align: center
                
          > label
            order: 3
            text-align: center
            flex: 100%
            
          > textarea
            flex: 1
            border: 0

      section.flavor
        padding: $gutter
        background: $faded-dark
        border-radius: $radius
        
        div
          background: $bg
          display: flex
          flex-direction: column-reverse
          padding: 5px
          border: 1px solid black
          
          label
            text-align: center
            font-size: 10px
            margin-top: 3px
            
          textarea
            border: 0
            border-radius: 0
            height: 4em
            
          &:first-child
            border-radius: $radius $radius 0 0

          &:not(:first-child)
            margin-top: $gutter
          
          &:last-child
            border-radius: 0 0 $radius $radius

      section.features
        padding: $gutter
        
        div
          padding: $gutter
          border: 1px solid black
          border-radius: $radius
          display: flex
          flex-direction: column-reverse
          label
            text-align: center
          textarea
            border: 0
            padding: 5px
            height: 43em
            height: 75em
  
  input::placeholder, li, div, span, ul, p, label, input, section, th, textarea, textarea::placeholder
    color: rgba(0, 0, 0, 0.1) !important
    border-color: transparent !important

  input, textarea
    opacity: 0 !important

  div.attr-applications
    background: grey
</style>

