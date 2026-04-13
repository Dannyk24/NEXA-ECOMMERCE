//HEADER SCROLL INTO VIEW LOGIC
/*====HELPERS====*/
function setActiveNavItem(navItem){
    navItems.forEach(item=>{
        item.classList.toggle('active-nav-item',
            item.dataset.section === navItem.dataset.section
        )/*Toggle takes a force parameter that adds the class if the condition returns true and removes it if the condition returns false*/
    })
}
function scrollSectionIntoView(section){
    section.scrollIntoView({
        behavior:'smooth',
    })
}


const navItemsContainer = document.querySelector('nav')
const navItems = document.querySelectorAll('.nav-item')
const sections = document.querySelectorAll('.js-main-sections')
navItemsContainer.addEventListener('click',(e)=>{
    if(!e.target.classList.contains('nav-item')){
        return
    }
    const navItem = e.target
    const sectionsArray = Array.from(sections)//Convert sections nodelist to array to gain access to the find method
    const section =  sectionsArray.find(section=>section.dataset.section === navItem.dataset.section)
    setActiveNavItem(navItem)
    scrollSectionIntoView(section)
    console.log(section);
})

const contactUsCta = document.querySelector('#contact-us-cta')
contactUsCta.addEventListener('click',(e)=>{
    e.preventDefault()//Prevent default behaviour cause contact us cta is an anchor tag
    scrollSectionIntoView(document.querySelector('#contact-us-section'))
})