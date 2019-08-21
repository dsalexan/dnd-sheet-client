import Vue from 'vue'
import Component from 'vue-class-component'

// O decorador @Component indica que a classe é um componente Vue
@Component({
    // Todas as opções de componentes são permitidas aqui
    template: '<q-badge align="middle">Sheet</q-badge>'
})
export default class MyComponent extends Vue {
    // Dados iniciais podem ser declarados como propriedades da instância
    public message: string = 'Hello!'

    // Métodos do componente podem ser declarados como métodos da instância
    public onClick(): void {
        window.alert(this.message)
    }
}
