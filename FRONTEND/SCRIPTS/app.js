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
    scrollSectionIntoView(document.querySelector('#contact-us-section'))/*Pass contact us section html element as the arguement*/
})


const observer = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            const sectionElem = entry.target
            const navItemsArray = Array.from(sections)/*convert navItems collection from nodelist toarray to access find method*/
            const matchingNavItem = navItemsArray.find(item=>item.dataset.section === sectionElem.dataset.section)/*Compare data section values to find matching nav item then call setActive function on it*/
            setActiveNavItem(matchingNavItem)
        }
    })
},{
    threshold:0.3/*Only activate when 30% of the section is visible*/
})
sections.forEach(section=>{
    observer.observe(section)
})/*The observe method only takes one dom element and cant take an array so we loop through each section and call an instance of the observer class*/