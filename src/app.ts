//validation
interface Validation{
    value:string | number
    require:boolean
    valueMinLength?: number
    valueMaxLength?: number
    min?: number
    max?: number
}

function validate (validationInput : Validation){
    let isValid = true
    if(validationInput.require){
        isValid= isValid && validationInput.value.toString().trim().length !== 0
    }
    if(validationInput.valueMinLength && typeof validationInput.value === "string"){
        isValid = isValid && validationInput.value.length >= validationInput.valueMinLength
    }
    if(validationInput.valueMaxLength && typeof validationInput.value === "string"){
        isValid = isValid && validationInput.value.length <= validationInput.valueMaxLength
    }
    if(validationInput.min && typeof validationInput.value === "number"){
        isValid = isValid && validationInput.value >= validationInput.min
    }
    if(validationInput.max && typeof validationInput.value === "number"){
        isValid = isValid && validationInput.value <= validationInput.max
    }
    return isValid
}

//


function autobind(target:any, methodName: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value
    const adjDescriptor : PropertyDescriptor={
        configurable:true,
        get(){
            const boundFn= originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

//class Project//

class ProjectList{
    templateElement :HTMLTemplateElement 
    hostElement : HTMLDivElement
    element: HTMLElement

    constructor(private type: "active" | "finished" ){
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content,true)
        this.element = importedNode.firstElementChild as HTMLElement
        this.element.id = `${this.type}-project`
        this.attach()
        this.renderContent()
    } 

    private renderContent(){
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul')!.id= listId
        this.element.querySelector("h2")!.textContent= this.type.toLocaleUpperCase() + " PROJECTS"
    }
    private attach(){
        this.hostElement.insertAdjacentElement('beforeend',this.element)
    }

}

class ProjectInput{
    templateElement :HTMLTemplateElement 
    hostElement : HTMLDivElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement
    constructor(){
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content,true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = "user-input"
        this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement
        this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement
        this.configure()
        this.attach()
    }
    @autobind
    private submitHandler(event:Event){
        event.preventDefault
        const userInput = this.gatherInput()
        if(Array.isArray(userInput)){
            const [title,desc,people] = userInput
            console.log(title,desc,people)
            this.clearInput()
        }   
        
    }

    private clearInput(){
        this.titleInputElement.value = ""
        this.descriptionInputElement.value= ""
        this.peopleInputElement.value = ""

    }
    private configure(){
        this.element.addEventListener("submit",this.submitHandler)
    }

    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin',this.element)
    }
    private gatherInput(): [string,string,number] | void{
        const enteredTitle = this.titleInputElement.value
        const entereddescription = this.descriptionInputElement.value
        const enteredPeople= this.peopleInputElement.value


        let validatedTitle: Validation ={
            value: enteredTitle,
            require: true
        } 
        let validatedDescription: Validation ={
            value: entereddescription ,
            require: true,
            valueMinLength: 5 
        } 
        let validatedPeople: Validation ={
            value: +enteredPeople,
            require: true,
            min: 3,
            max: 5
        } 
        
        
        

        if(!validate(validatedTitle) || !validate(validatedDescription) || !validate(validatedPeople) ){
            alert("Invalid input, please try again!")
            return
        }else{
            return [enteredTitle, entereddescription, +enteredPeople]
        }
    }
}

const prjInput = new ProjectInput()
const PrjListActive = new ProjectList('active')
const PrjListFinished = new ProjectList('finished')