import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    games = [
        { id: 1, title: 'Fable', genre: 'RPG de Accion', price: 285000, image: 'https://tse2.mm.bing.net/th/id/OIP.S14N-CulD3OYK9qeVgZCbgHaKd?r=0&w=500&h=706&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'El reinicio de la icónica saga de fantasía y humor británico desarrollado por Playground Games, que nos devolverá al mundo de Albion con mecánicas modernas de nueva generación.' },
        { id: 2, title: 'Final Fantasy VII Revelation', genre: 'JRPG', price: 296000, image: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2026/06/final-fantasy-vii-revelation-tag-page-cover-art.jpg?q=49&fit=contain&w=480&dpr=2', description: 'El tercer y último capítulo de la trilogía del remake, en el que el grupo contará con la nave Highwind para explorar el mundo abierto, realizar saltos en paracaídas y enfrentarse finalmente a Sefirot.' },
        { id: 3, title: 'GoW: Laufey', genre: 'Acción y Aventura', price: 278000, image: 'https://tse4.mm.bing.net/th/id/OIP.2SgUxbXZ8nPzRcb8havR8QHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Un título que expande el universo de la saga nórdica enfocándose en una historia protagonizada por Faye, lo que representa un cambio de protagonista temporal en la franquicia' },
        { id: 4, title: 'Mass Effect 5', genre: 'RPG de Accion y Ciencia Ficcion', price: 287000, image: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/mixcollage-07-dec-2024-08-52-am-1275.jpg?q=49&fit=contain&w=480&dpr=2', description: 'La próxima entrega de la épica saga de ciencia ficción de BioWare, que promete continuar el legado de la franquicia explorando nuevas fronteras galácticas.' },
        { id: 5, title: 'Resident Evil Veronica', genre: 'Survival Horror', price: 285000, image: 'https://tse4.mm.bing.net/th/id/OIP.GcGRLHWXtlxyI5AGjHjy-QHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'El remake moderno del clásico Code: Veronica, reconstruido con el RE Engine para ofrecer una experiencia de terror de supervivencia y puzles adaptada a los estándares actuales.' },
        { id: 6, title: 'The Wolf Among Us 2', genre: 'Aventura Grafica Narrativa', price: 180000, image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0a52eefd-6738-4aa9-a3f9-e54269465122/df2skkk-49cf77e7-48f5-40c0-891c-9ed304eabe7b.png/v1/fill/w_1280,h_1948,q_80,strp/the_wolf_among_us_2_by_nazmussshakib3_df2skkk-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTk0OCIsInBhdGgiOiJcL2ZcLzBhNTJlZWZkLTY3MzgtNGFhOS1hM2Y5LWU1NDI2OTQ2NTEyMlwvZGYyc2tray00OWNmNzdlNy00OGY1LTQwYzAtODkxYy05ZWQzMDRlYWJlN2IucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.j059vU1SWgEgv1UEx0befF7YkXVXcLAlPXe6ZfwTZ1M', description: 'Una aventura gráfica episódica de Telltale Games que retoma la oscura historia detectivesca de Bigby Wolf resolviendo crímenes en Fabletown.' }
    ];

    getGameById(id: number) {
        return this.games.find(g => g.id === id);
    }
}