CodeSystem: CS
Id: CS
* ^status = #active
* ^content = #example
* ^version = "1.0.0"
* ^filter.code = #x
* ^filter.description = "a descrição"
* ^filter.operator = #is-a
* ^filter.value = "ok"
* ^count = 3
* #alto
* #alto ^designation.use.code = #draft
* #alto ^designation.language = #pt-br
* #alto ^designation.value = "acima da média"

// Acrescenta conceito do tipo is-a (subconceito) com extensão

* #alto #bem "muito alto"
* #alto #bem ^extension.url = "http://ok"
* #alto #bem ^extension.valueString = "certo"

// Acrescenta extensão ao CodeSystem

* ^extension.url = "outra"
* ^extension.valueString = "outra"
